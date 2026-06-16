import { readdir, readFile, realpath, symlink, unlink } from "fs/promises"
import { existsSync } from "fs"
import { join, basename, dirname } from "path"
import { platform, homedir } from "os"
import * as yaml from "js-yaml"
import type { SkillRecord } from "@skill-manager/scanner"

export interface ScanResult {
  skills: SkillRecord[]
  availableTools: string[]
}

/** Known tools and their skill directories */
const BUILTIN_TOOLS: Record<string, string[]> = {
  codex: [join(homedir(), ".codex", "skills")],
  claude: [join(homedir(), ".agents", "skills")],
  cursor: [
    join(homedir(), "Library", "Application Support", "Cursor", "User", "skills"),
    join(homedir(), ".cursor", "skills")
  ]
}

let customToolDirs: Record<string, string[]> = {}

export function setCustomToolDirs(tools: { name: string; path: string }[]): void {
  customToolDirs = {}
  for (const t of tools) {
    customToolDirs[t.name] = [t.path]
  }
}

function getAllToolDirs(): Record<string, string[]> {
  return { ...BUILTIN_TOOLS, ...customToolDirs }
}

/** Additional known skill source directories */
const EXTRA_SOURCE_DIRS: string[] = []

export class ScannerOrchestrator {
  /**
   * Scan ALL known paths for skills, deduplicate by directory name,
   * and detect which tools each skill is linked to.
   */
  async scanAll(): Promise<ScanResult> {
    const seen = new Map<string, SkillRecord>()

    // Collect all paths to scan: tool dirs + extra sources
    const allPaths = new Set<string>()
    for (const dirs of Object.values(getAllToolDirs())) {
      for (const d of dirs) allPaths.add(d)
    }
    for (const d of EXTRA_SOURCE_DIRS) allPaths.add(d)

    // Scan each path for skill directories
    for (const scanPath of Array.from(allPaths)) {
      if (!existsSync(scanPath)) continue
      const entries = await readdir(scanPath, { withFileTypes: true }).catch(() => [])
      for (const entry of entries) {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
        const skillDir = join(scanPath, entry.name)
        const skill = await this.parseSkill(skillDir)
        if (!skill) continue

        // Deduplicate: if we've seen this skill name before, prefer the entry with better metadata
        const existing = seen.get(skill.id)
        if (!existing) {
          seen.set(skill.id, skill)
        } else if (!existing.name && skill.name) {
          // Prefer the version with a real name (from SKILL.md),
          // but keep the ORIGINAL sourcePath (first discovery location)
          seen.set(skill.id, { ...existing, name: skill.name, description: skill.description })
        }
      }
    }

    // For each skill, detect which tools it's linked to
    const skills = Array.from(seen.values())
    for (const skill of skills) {
      const linkedTools: string[] = []

      for (const [tool, dirs] of Object.entries(getAllToolDirs())) {
        for (const toolDir of dirs) {
          const linkPath = join(toolDir, skill.id)
          if (existsSync(linkPath)) {
            try {
              const realTarget = await realpath(linkPath)
              const realSource = await realpath(skill.sourcePath)
              if (realTarget === realSource) {
                linkedTools.push(tool)
                break
              }
            } catch {
              // broken symlink or other issue
            }
          }
        }
      }

      skill.linkedTools = linkedTools

      // Detect home tool: where the skill's source path physically is
      const resolvedSource = await realpath(skill.sourcePath).catch(() => skill.sourcePath)
      for (const [tool, dirs] of Object.entries(getAllToolDirs())) {
        for (const toolDir of dirs) {
          const resolvedToolDir = await realpath(toolDir).catch(() => toolDir)
          if (resolvedSource.startsWith(resolvedToolDir + "/")) {
            skill.homeTool = tool
            break
          }
        }
        if (skill.homeTool) break
      }
    }

    return { skills, availableTools: Object.keys(getAllToolDirs()) }
  }

  /**
   * Create a symlink: tool-dir/<skill-name> -> skillDir
   */
  async linkSkill(skillDir: string, toolName: string): Promise<boolean> {
    const toolDirs = getAllToolDirs()[toolName]
    if (!toolDirs || toolDirs.length === 0) return false

    const skillId = basename(skillDir)
    const linkPath = join(toolDirs[0], skillId)

    // Don't create symlink if target already exists
    if (existsSync(linkPath)) return false

    // Create parent dir if needed
    const parentDir = dirname(linkPath)
    if (!existsSync(parentDir)) {
      try {
        const { mkdir } = await import("fs/promises")
        await mkdir(parentDir, { recursive: true })
      } catch {
        return false
      }
    }

    await symlink(skillDir, linkPath)
    return true
  }

  /**
   * Remove a symlink: tool-dir/<skill-name>
   */
  async unlinkSkill(skillDir: string, toolName: string): Promise<boolean> {
    const toolDirs = getAllToolDirs()[toolName]
    if (!toolDirs || toolDirs.length === 0) return false

    const skillId = basename(skillDir)
    const linkPath = join(toolDirs[0], skillId)

    if (!existsSync(linkPath)) return false
    await unlink(linkPath)
    return true
  }

  /**
   * Parse a skill directory's SKILL.md and return a SkillRecord.
   */
  private async parseSkill(dir: string): Promise<SkillRecord | null> {
    try {
      const skillId = basename(dir)
      const skillMdPath = join(dir, "SKILL.md")
      let name = skillId
      let description = ""
      let formatVersion: string | undefined

      if (existsSync(skillMdPath)) {
        const content = await readFile(skillMdPath, "utf-8")
        const frontmatter = this.parseFrontmatter(content)
        if (typeof frontmatter?.name === "string") name = frontmatter.name
        if (typeof frontmatter?.description === "string") description = frontmatter.description
        if (frontmatter?.version) formatVersion = String(frontmatter.version)
      }

      // Also check plugin.json for Cursor-format skills
      const pluginPath = join(dir, "plugin.json")
      if (!existsSync(skillMdPath) && existsSync(pluginPath)) {
        const content = await readFile(pluginPath, "utf-8")
        const manifest = JSON.parse(content)
        if (manifest.name) name = manifest.name
        if (manifest.description) description = manifest.description || ""
        if (manifest.version) formatVersion = manifest.version?.toString()
      }

      return {
        id: skillId,
        name,
        description,
        sourcePath: dir,
        linkedTools: [],
        formatVersion
      }
    } catch {
      return null
    }
  }

  private parseFrontmatter(content: string): Record<string, unknown> | null {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null
    try {
      return yaml.load(match[1]) as Record<string, unknown> | null as Record<string, unknown> | null as Record<string, unknown> | null
    } catch {
      return null
    }
  }
}
