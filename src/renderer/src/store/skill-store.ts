import { create } from "zustand"
import type { SkillRecord, SkillStore, ScanStatus } from "./types"
import api from "../ipc-client"

function groupByTool(skills: SkillRecord[]): Record<string, SkillRecord[]> {
  const groups: Record<string, SkillRecord[]> = {}
  for (const skill of skills) {
    const tool = skill.toolOrigin || "other"
    if (!groups[tool]) groups[tool] = []
    groups[tool].push(skill)
  }
  return groups
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  skills: [],
  enabledIds: new Set<string>(),
  scanStatus: "idle" as ScanStatus,
  error: null,

  scan: async () => {
    set({ scanStatus: "scanning", error: null })
    try {
      const result = await api.scan()
      const skills = result.skills
      // Auto-enable all newly scanned skills
      const enabledIds = new Set(skills.map((s) => s.id))
      set({ skills, enabledIds, scanStatus: "done" })
    } catch (e) {
      set({
        scanStatus: "error",
        error: e instanceof Error ? e.message : "Unknown error"
      })
    }
  },

  toggleSkill: (id: string) => {
    const { enabledIds } = get()
    const next = new Set(enabledIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    set({ enabledIds: next })
  },

  enableAll: () => {
    const ids = new Set(get().skills.map((s) => s.id))
    set({ enabledIds: ids })
  },

  disableAll: () => {
    set({ enabledIds: new Set() })
  },

  setEnabledIds: (ids: string[]) => {
    set({ enabledIds: new Set(ids) })
  },

  get enabledSkills(): SkillRecord[] {
    return get().skills.filter((s) => get().enabledIds.has(s.id))
  },

  get totalCount(): number {
    return get().skills.length
  },

  get enabledCount(): number {
    return get().enabledIds.size
  },

  get groupedByTool(): Record<string, SkillRecord[]> {
    return groupByTool(get().skills)
  }
}))
