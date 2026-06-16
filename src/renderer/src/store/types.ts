export interface SkillRecord {
  id: string
  name: string
  description: string
  sourcePath: string
  linkedTools: string[]
  homeTool?: string
  formatVersion?: string
}

export interface ScanResult {
  skills: SkillRecord[]
  availableTools: string[]
}

export type ScanStatus = "idle" | "scanning" | "done" | "error"

export interface SkillStore {
  skills: SkillRecord[]
  scanStatus: ScanStatus
  error: string | null
  scan: () => Promise<void>
  linkSkill: (skillPath: string, toolName: string) => Promise<void>
  unlinkSkill: (skillPath: string, toolName: string) => Promise<void>
  availableTools: string[]
}
