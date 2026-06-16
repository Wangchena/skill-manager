import { resolve } from "path"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  builder: {
    appId: "com.skill-manager.app",
    productName: "Skill Manager",
    directories: {
      output: "dist"
    },
    mac: {
      icon: "build/icon.png",
      target: [
        { target: "dmg", arch: ["x64", "arm64"] },
        { target: "zip", arch: ["x64", "arm64"] }
      ],
      category: "public.app-category.developer-tools"
    },
    win: {
      icon: "build/icon.png",
      target: [{ target: "nsis", arch: ["x64"] }]
    },
    linux: {
      icon: "build/icon.png",
      target: [{ target: "AppImage", arch: ["x64"] }, { target: "deb", arch: ["x64"] }],
      category: "Development"
    },
    publish: null
  },

  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ["@skill-manager/scanner", "archiver"]
      })
    ],
    resolve: {
      alias: {
        "@skill-manager/scanner": resolve("packages/scanner/src/index.ts")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src")
      }
    },
    plugins: [tailwindcss(), react()]
  }
})
