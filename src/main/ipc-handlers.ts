import { ipcMain, dialog } from "electron"
import { ScannerOrchestrator } from "./scanner-orchestrator"
import { SnapshotManager } from "./snapshot-manager"
import { SkillExporter } from "./skill-exporter"
import { SettingsStore } from "./settings-store"
import { setCustomToolDirs } from "./scanner-orchestrator"

export function registerIpcHandlers(): void {
  const orchestrator = new ScannerOrchestrator()
  const snapshotManager = new SnapshotManager()
  const skillExporter = new SkillExporter()
  const settingsStore = new SettingsStore()

  ipcMain.handle("scan", async () => {
    const settings = await settingsStore.load()
    if (settings.customTools) {
      setCustomToolDirs(settings.customTools)
    }
    return orchestrator.scanAll()
  })
  ipcMain.handle("link-skill", async (_event, payload: { skillPath: string; toolName: string }) => {
    const settings = await settingsStore.load()
    if (settings.customTools) {
      setCustomToolDirs(settings.customTools)
    }
    return orchestrator.linkSkill(payload.skillPath, payload.toolName)
  })

  ipcMain.handle("unlink-skill", async (_event, payload: { skillPath: string; toolName: string }) => {
    const settings = await settingsStore.load()
    if (settings.customTools) {
      setCustomToolDirs(settings.customTools)
    }
    return orchestrator.unlinkSkill(payload.skillPath, payload.toolName)
  })


  ipcMain.handle("export-snapshot", async (_event, data: unknown) => {
    const { filePath } = await dialog.showSaveDialog({
      filters: [{ name: "Skill Snapshot", extensions: ["json"] }]
    })
    if (!filePath) return null
    await snapshotManager.exportSnapshot(filePath, data)
    return filePath
  })

  ipcMain.handle("import-snapshot", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      filters: [{ name: "Skill Snapshot", extensions: ["json"] }],
      properties: ["openFile"]
    })
    if (!filePaths?.length) return null
    return snapshotManager.importSnapshot(filePaths[0])
  })

  ipcMain.handle("download-skill", async (_event, skillPath: string) => {
    const { filePath } = await dialog.showSaveDialog({
      filters: [{ name: "Archive", extensions: ["zip"] }]
    })
    if (!filePath) return null
    await skillExporter.exportSkill(skillPath, filePath)
    return filePath
  })

  ipcMain.handle("get-settings", async () => {
    return settingsStore.load()
  })

  ipcMain.handle("save-settings", async (_event, settings) => {
    settingsStore.save(settings)
  })
}
