import { create } from "zustand"
import api from "../ipc-client"

interface ScannerPathOverrides {
  [toolName: string]: string
}

interface SettingsStore {
  pathOverrides: ScannerPathOverrides
  enabledTools: string[]
  loaded: boolean

  load: () => Promise<void>
  setPathOverride: (tool: string, path: string) => void
  removePathOverride: (tool: string) => void
  toggleTool: (tool: string) => void
  save: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  pathOverrides: {},
  enabledTools: [],
  loaded: false,

  load: async () => {
    try {
      const settings = (await api.getSettings()) as {
        scannerPaths?: Record<string, string>
        enabledTools?: string[]
      }
      set({
        pathOverrides: settings.scannerPaths || {},
        enabledTools: settings.enabledTools || [],
        loaded: true
      })
    } catch {
      set({ loaded: true })
    }
  },

  setPathOverride: (tool: string, path: string) => {
    const overrides = { ...get().pathOverrides, [tool]: path }
    set({ pathOverrides: overrides })
  },

  removePathOverride: (tool: string) => {
    const { [tool]: _, ...rest } = get().pathOverrides
    set({ pathOverrides: rest })
  },

  toggleTool: (tool: string) => {
    const current = get().enabledTools
    const next = current.includes(tool)
      ? current.filter((t) => t !== tool)
      : [...current, tool]
    set({ enabledTools: next })
  },

  save: async () => {
    const { pathOverrides, enabledTools } = get()
    await api.saveSettings({ scannerPaths: pathOverrides, enabledTools })
  }
}))
