import { create } from "zustand"
import api from "../ipc-client"

interface CustomTool {
  name: string
  path: string
}

interface SettingsStore {
  customTools: CustomTool[]
  loaded: boolean

  load: () => Promise<void>
  addCustomTool: (name: string, path: string) => void
  removeCustomTool: (name: string) => void
  save: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  customTools: [],
  loaded: false,

  load: async () => {
    try {
      const settings = (await api.getSettings()) as {
        customTools?: { name: string; path: string }[]
      }
      set({
        customTools: settings.customTools || [],
        loaded: true
      })
    } catch {
      set({ loaded: true })
    }
  },

  addCustomTool: (name: string, path: string) => {
    const tools = [...get().customTools, { name, path }]
    set({ customTools: tools })
  },

  removeCustomTool: (name: string) => {
    const tools = get().customTools.filter((t) => t.name !== name)
    set({ customTools: tools })
  },

  save: async () => {
    const { customTools } = get()
    await api.saveSettings({ customTools })
  }
}))
