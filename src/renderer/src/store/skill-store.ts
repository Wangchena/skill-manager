import { create } from "zustand"
import type { SkillRecord, SkillStore, ScanStatus } from "./types"
import api from "../ipc-client"

export const useSkillStore = create<SkillStore>((set, get) => ({
  skills: [],
  availableTools: [],
  scanStatus: "idle" as ScanStatus,
  error: null,

  scan: async () => {
    set({ scanStatus: "scanning", error: null })
    try {
      const result = await api.scan()
      set({ skills: result.skills, availableTools: result.availableTools || [], scanStatus: "done" })
    } catch (e) {
      set({
        scanStatus: "error",
        error: e instanceof Error ? e.message : "Unknown error"
      })
    }
  },

  linkSkill: async (skillPath: string, toolName: string) => {
    await api.linkSkill(skillPath, toolName)
    // Re-scan to refresh state
    const result = await api.scan()
    set({ skills: result.skills, availableTools: result.availableTools || [], scanStatus: "done" })
  },

  unlinkSkill: async (skillPath: string, toolName: string) => {
    await api.unlinkSkill(skillPath, toolName)
    // Re-scan to refresh state
    const result = await api.scan()
    set({ skills: result.skills, availableTools: result.availableTools || [], scanStatus: "done" })
  },




}))
