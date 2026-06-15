import { readdir, readFile } from "fs/promises"
import { homedir } from "os"
import { join, basename } from "path"
import { existsSync } from "fs"
import * as yaml from "js-yaml"
import { Scanner } from "./scanner.js"
import type { SkillRecord } from "./types.js"
import type { OS } from "./platform.js"

export class ClaudeScanner extends Scanner {
  name = "Claude Code"

  defaultPaths(os: OS): string[] {
    const home = homedir()
    switch (os) {
      case "darwin":
      case "linux":
        return [join(home, ".agents", "skills")]
      case "win32":
        return [join(home, ".agents", "skills")]
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
      const skillMdPath = join(dir, "SKILL.md")

      if (!existsSync(skillMdPath)) return null

      const content = await readFile(skillMdPath, "utf-8")
      const frontmatter = this.parseYamlFrontmatter(content)

      return {
        id: skillId,
        name: frontmatter?.name || skillId,
        description: frontmatter?.description || "",
        sourcePath: dir,
        toolOrigin: "claude",
        formatVersion: frontmatter?.version?.toString()
      }
    } catch {
      return null
    }
  }

  private parseYamlFrontmatter(
    content: string
  ): Record<string, unknown> | null {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return null
    return yaml.load(match[1]) as Record<string, unknown> | null
  }
}
