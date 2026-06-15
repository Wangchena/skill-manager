import { readFile, writeFile, mkdir } from "fs/promises"
import { homedir } from "os"
import { join } from "path"
import { existsSync } from "fs"

interface Settings {
  scannerPaths?: Record<string, string>
  enabledTools?: string[]
}

const SETTINGS_PATH = join(homedir(), ".skill-manager", "settings.json")

export class SettingsStore {
  async load(): Promise<Settings> {
    try {
      const raw = await readFile(SETTINGS_PATH, "utf-8")
      return JSON.parse(raw) as Settings
    } catch {
      return {}
    }
  }

  async save(settings: Settings): Promise<void> {
    const dir = join(homedir(), ".skill-manager")
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
    await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8")
  }
}
