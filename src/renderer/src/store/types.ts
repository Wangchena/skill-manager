export interface SkillRecord {
  id: string
  name: string
  description: string
  sourcePath: string
  toolOrigin: string
  formatVersion?: string
}

export interface ScanResult {
  skills: SkillRecord[]
}

export type ScanStatus = "idle" | "scanning" | "done" | "error"

export interface SkillStore {
  skills: SkillRecord[]
  enabledIds: Set<string>
  scanStatus: ScanStatus
  error: string | null
  scan: () => Promise<void>
  toggleSkill: (id: string) => void
  enableAll: () => void
  disableAll: () => void
  setEnabledIds: (ids: string[]) => void
  enabledSkills: SkillRecord[]
  totalCount: number
  enabledCount: number
  groupedByTool: Record<string, SkillRecord[]>
}
