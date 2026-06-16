import { app, BrowserWindow, nativeImage, shell } from "electron"
import { join, resolve } from "path"
import { registerIpcHandlers } from "./ipc-handlers"

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, "icon.png")
    : resolve(__dirname, "../../build/icon.png")
  const icon = nativeImage.createFromPath(iconPath)

  mainWindow = new BrowserWindow({
    icon: icon,
    width: 960,
    height: 700,
    minWidth: 720,
    minHeight: 500,
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }
}

// Set app name (affects macOS dock tooltip, menu bar, About panel)
// Override Electron's macOS dock label, menu bar, and About panel
app.name = "Skill Manager"

if (process.platform === "darwin") {
  // Force Dock refresh by reading the name back
  const _ = app.name
  app.setAboutPanelOptions({ applicationName: "Skill Manager" })
}

app.whenReady().then(() => {
  registerIpcHandlers()
  // Set macOS dock icon
  if (process.platform === "darwin") {
    const dockIconPath = app.isPackaged
      ? join(process.resourcesPath, "icon.png")
      : resolve(__dirname, "../../build/icon.png")
    const dockIcon = nativeImage.createFromPath(dockIconPath)
    if (!dockIcon.isEmpty()) {
      app.dock.setIcon(dockIcon)
    }
  }
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
