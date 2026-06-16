import { readdir, readFile } from "fs/promises"
import { homedir } from "os"
import { join, basename } from "path"
import { existsSync } from "fs"
import { Scanner } from "./scanner.js"
import type { SkillRecord } from "./types.js"
import type { OS } from "./platform.js"

export class CodexScanner extends Scanner {
  name = "Codex"

  defaultPaths(os: OS): string[] {
    const home = homedir()
    switch (os) {
      case "darwin":
      case "linux":
        return [join(home, ".codex", "skills")]
      case "win32":
        return [join(home, ".codex", "skills")]
    }
  }

  async scan(paths: string[]): Promise<SkillRecord[]> {
    const skills: SkillRecord[] = []

    for (const dir of paths) {
      if (!existsSync(dir)) continue

      const entries = await readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const skillDir = join(dir, entry.name)
        const skill = await this.parseSkill(skillDir)
        if (skill) skills.push(skill)
      }
    }

    return skills
  }

    private async parseSkill(dir: string): Promise<SkillRecord | null> {
    try {
      const skillId = basename(dir)

      // Try SKILL.md frontmatter first
      const skillMdPath = join(dir, "SKILL.md")
      if (existsSync(skillMdPath)) {
        const content = await readFile(skillMdPath, "utf-8")
        const frontmatter = this.parseFrontmatter(content)
        if (frontmatter?.name) {
          return {
            id: skillId,
            name: frontmatter.name,
            description: frontmatter.description || "",
            sourcePath: dir,
            linkedTools: ["codex"],
            homeTool: "codex"
          }
        }
      }

      // Fallback: use directory name as skill name
      return {
        id: skillId,
        name: skillId,
        description: "",
        sourcePath: dir,
        linkedTools: ["codex"],
        homeTool: "codex"
      }
    } catch {
      return null
    }
  }

  private parseFrontmatter(
    content: string
  ): { name?: string; description?: string } | null {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null

    const yaml = match[1]
    const result: Record<string, string> = {}

    for (const line of yaml.split("\n")) {
      const kvMatch = line.match(/^\s*(\w+)\s*:\s*(.+)$/)
      if (kvMatch) {
        result[kvMatch[1]] = kvMatch[2].trim().replace(/^["']|["']$/g, "")
      }
    }

    return result
  }
}
