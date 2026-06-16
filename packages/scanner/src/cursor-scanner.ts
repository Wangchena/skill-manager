import { readdir, readFile } from "fs/promises"
import { homedir } from "os"
import { join, basename } from "path"
import { existsSync } from "fs"
import { Scanner } from "./scanner.js"
import type { SkillRecord } from "./types.js"
import type { OS } from "./platform.js"

export class CursorScanner extends Scanner {
  name = "Cursor"

  defaultPaths(os: OS): string[] {
    const home = homedir()
    switch (os) {
      case "darwin":
        return [
          join(home, "Library", "Application Support", "Cursor", "User", "skills"),
          join(home, ".cursor", "skills")
        ]
      case "linux":
        return [join(home, ".config", "Cursor", "skills"), join(home, ".cursor", "skills")]
      case "win32":
        return [
          join(home, "AppData", "Roaming", "Cursor", "User", "skills"),
          join(home, ".cursor", "skills")
        ]
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
      const manifestPath = join(dir, "plugin.json")

      // Try plugin.json format
      if (existsSync(manifestPath)) {
        const content = await readFile(manifestPath, "utf-8")
        const manifest = JSON.parse(content)
        return {
          id: skillId,
          name: manifest.name || skillId,
          description: manifest.description || "",
          sourcePath: dir,
          linkedTools: ["cursor"], homeTool: "cursor",
          formatVersion: manifest.version?.toString()
        }
      }

      // Fallback: directory name as skill name
      return {
        id: skillId,
        name: skillId,
        description: "",
        sourcePath: dir,
        linkedTools: ["cursor"], homeTool: "cursor"
      }
    } catch {
      return null
    }
  }
}
