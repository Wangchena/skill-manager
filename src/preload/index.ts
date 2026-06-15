import { contextBridge, ipcRenderer } from "electron"

const api = {
  scan: (): Promise<import("../main/scanner-orchestrator").ScanResult> =>
    ipcRenderer.invoke("scan"),

  exportSnapshot: (data: unknown): Promise<string | null> =>
    ipcRenderer.invoke("export-snapshot", data),

  importSnapshot: (): Promise<unknown> =>
    ipcRenderer.invoke("import-snapshot"),

  downloadSkill: (skillPath: string): Promise<string | null> =>
    ipcRenderer.invoke("download-skill", skillPath),

  getSettings: (): Promise<Record<string, unknown>> =>
    ipcRenderer.invoke("get-settings"),

  saveSettings: (settings: Record<string, unknown>): Promise<void> =>
    ipcRenderer.invoke("save-settings", settings)
}

contextBridge.exposeInMainWorld("api", api)

export type Api = typeof api
