import type { SkillRecord } from "@skill-manager/scanner"
import { CodexScanner } from "@skill-manager/scanner"
import { ClaudeScanner } from "@skill-manager/scanner"
import { CursorScanner } from "@skill-manager/scanner"
import { platform } from "os"

export interface ScanResult {
  skills: SkillRecord[]
}

export class ScannerOrchestrator {
  private scanners = [new CodexScanner(), new ClaudeScanner(), new CursorScanner()]

  async scanAll(): Promise<ScanResult> {
    const currentOs = platform() as "darwin" | "win32" | "linux"
    const allSkills: SkillRecord[] = []

    for (const scanner of this.scanners) {
      const paths = scanner.defaultPaths(currentOs)
      const skills = await scanner.scan(paths)
      allSkills.push(...skills)
    }

    // Deduplicate by source path
    const seen = new Set<string>()
    const unique: SkillRecord[] = []
    for (const skill of allSkills) {
      if (!seen.has(skill.sourcePath)) {
        seen.add(skill.sourcePath)
        unique.push(skill)
      }
    }

    return { skills: unique }
  }
}
