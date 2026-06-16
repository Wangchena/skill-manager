import React, { useEffect, useState } from "react"
import { useSkillStore } from "./store/skill-store"
import SkillCard from "./components/SkillCard"
import EmptyState from "./components/EmptyState"
import RefreshButton from "./components/RefreshButton"
import ExportDialog from "./components/ExportDialog"
import ImportDialog from "./components/ImportDialog"
import SettingsPanel from "./components/SettingsPanel"
import { Settings, Upload, Download, Search } from "lucide-react"
import AppIcon from "./components/AppIcon"

type ActivePanel = "export" | "import" | "settings" | null

const App: React.FC = () => {
  const { skills, scanStatus, scan, linkSkill, unlinkSkill, availableTools } = useSkillStore()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const isLoading = scanStatus === "scanning"

  useEffect(() => {
    scan()
  }, [scan])

  const filtered = searchQuery
    ? skills.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sourcePath.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : skills

  return (
    <div className="flex h-screen flex-col bg-[hsl(220,14%,94%)]">
      {/* Top accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/70 bg-white/95 backdrop-blur-sm px-5 py-2.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2.5">
          <AppIcon size={28} />
          <h1 className="text-[13px] font-semibold text-gray-900 tracking-tight">Skills</h1>
          {skills.length > 0 && (
            <span className="rounded-[5px] bg-gray-100 px-1.5 py-[1px] text-[11px] font-medium text-gray-500">
              {skills.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-48 rounded-[7px] border border-gray-200/80 bg-gray-50/60 pl-8 pr-3 py-1.5 text-[12px] text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setActivePanel("export")}
              className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
              title="Export"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePanel("import")}
              className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
              title="Import"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <RefreshButton onClick={scan} loading={isLoading} />
            <button
              onClick={() => setActivePanel("settings")}
              className="inline-flex items-center justify-center rounded-[7px] p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
              title="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-[2.5px] border-gray-200" />
              <div className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-[2.5px] border-transparent border-t-blue-500" />
            </div>
            <p className="mt-4 text-[13px] text-gray-400 font-medium">Scanning skills...</p>
          </div>
        )}

        {!isLoading && scanStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="rounded-[10px] border border-red-200/60 bg-red-50/70 px-5 py-4 text-center">
              <p className="text-[13px] font-semibold text-red-600">Scan failed</p>
              <p className="mt-1 text-xs text-red-400/80">Check your configuration and try again.</p>
            </div>
          </div>
        )}

        {!isLoading && scanStatus === "done" && skills.length === 0 && (
          <EmptyState
            icon="search"
            title="No skills found"
            description="Install some skills to get started, then refresh."
          />
        )}

        {!isLoading && scanStatus === "done" && filtered.length === 0 && skills.length > 0 && (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gray-100/70">
              <Search className="h-6 w-6 text-gray-400/80" />
            </div>
            <h3 className="mt-4 text-[14px] font-semibold text-gray-900">No results</h3>
            <p className="mt-1 text-[13px] text-gray-400">Try a different search term.</p>
          </div>
        )}

        {!isLoading && scanStatus === "done" && filtered.length > 0 && (
          <div className="p-5">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-2.5" role="list">
                {filtered.map((skill, idx) => (
                  <div key={skill.id} style={{ "--delay": `${idx * 40}ms` } as React.CSSProperties}>
                    <SkillCard
                      skill={skill}
                      onLink={linkSkill}
                      onUnlink={unlinkSkill}
                      availableTools={availableTools}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <ExportDialog open={activePanel === "export"} onClose={() => setActivePanel(null)} />
      <ImportDialog open={activePanel === "import"} onClose={() => setActivePanel(null)} />
      <SettingsPanel open={activePanel === "settings"} onClose={() => setActivePanel(null)} />
    </div>
  )
}

export default App
