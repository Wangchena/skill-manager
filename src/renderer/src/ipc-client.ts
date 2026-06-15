import type { ScanResult } from "./store/types"

export interface ApiClient {
  scan(): Promise<ScanResult>
  exportSnapshot(data: unknown): Promise<string | null>
  importSnapshot(): Promise<unknown>
  downloadSkill(skillPath: string): Promise<string | null>
  getSettings(): Promise<Record<string, unknown>>
  saveSettings(settings: Record<string, unknown>): Promise<void>
}

const api: ApiClient = window.api

export default api
