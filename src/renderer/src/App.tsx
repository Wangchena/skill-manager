import React, { useEffect, useState, useRef } from "react"
import { useSkillStore } from "./store/skill-store"
import TabBar from "./components/TabBar"
import SkillCard from "./components/SkillCard"
import SummaryBar from "./components/SummaryBar"
import EmptyState from "./components/EmptyState"
import RefreshButton from "./components/RefreshButton"
import ExportDialog from "./components/ExportDialog"
import ImportDialog from "./components/ImportDialog"
import SettingsPanel from "./components/SettingsPanel"
import {
  Command,
  Upload,
  Download,
  CheckSquare,
  Square,
  Settings
} from "lucide-react"

type ActivePanel = "export" | "import" | "settings" | null

const TOOL_LABELS: Record<string, string> = {
  codex: "Codex",
  claude: "Claude",
  cursor: "Cursor"
}

const App: React.FC = () => {
  const {
    skills,
    enabledIds,
    scanStatus,
    scan,
    toggleSkill,
    enableAll,
    disableAll
  } = useSkillStore()

  const [activeTab, setActiveTab] = useState<string>("")
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scan()
  }, [scan])

  const tools = Array.from(new Set(skills.map((s) => s.toolOrigin))).sort()

  useEffect(() => {
    if (tools.length > 0 && !activeTab) {
      setActiveTab(tools[0])
    }
  }, [tools, activeTab])

  const currentSkills = skills.filter((s) => s.toolOrigin === activeTab)
  const totalCount = skills.length
  const enabledCount = enabledIds.size
  const isLoading = scanStatus === "scanning"

  return (
    <div className="flex h-screen flex-col bg-[hsl(220,14%,94%)]">
      {/* Thin gradient accent bar at the very top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/70 bg-white/95 backdrop-blur-sm px-5 py-2.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_1px_3px_0_rgba(59,130,246,0.35)]">
            <Command className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-[13px] font-semibold text-gray-900 tracking-tight">Skills</h1>
          {totalCount > 0 && (
            <span className="ml-0.5 rounded-[5px] bg-gray-100 px-1.5 py-[1px] text-[11px] font-medium text-gray-500">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {totalCount > 0 && (
            <>
              <button
                onClick={enableAll}
                className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
                title="Enable all"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Enable all</span>
              </button>
              <button
                onClick={disableAll}
                className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
                title="Disable all"
              >
                <Square className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Disable all</span>
              </button>
              <div className="mx-1.5 h-4 w-px bg-gray-200/70" />
              <button
                onClick={() => setActivePanel("export")}
                className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
                title="Export"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setActivePanel("import")}
                className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
                title="Import"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <div className="mx-1.5 h-4 w-px bg-gray-200/70" />
            </>
          )}
          <RefreshButton onClick={scan} loading={isLoading} />
          <button
            onClick={() => setActivePanel("settings")}
            className="inline-flex items-center justify-center rounded-[7px] p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all active:scale-[0.97]"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Summary + Tabs — only shown when there are skills */}
      {totalCount > 0 && (
        <div className="border-b border-gray-200/60 bg-white">
          <div className="px-5 pt-3 pb-1.5">
            <SummaryBar totalCount={totalCount} enabledCount={enabledCount} />
          </div>
          <div className="px-5 pb-2.5">
            <TabBar tools={tools} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-[2.5px] border-gray-200" />
              <div className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-[2.5px] border-transparent border-t-blue-500" />
            </div>
            <p className="mt-4 text-[13px] text-gray-400 font-medium">Scanning skills...</p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && scanStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-36">
            <div className="rounded-[10px] border border-red-200/60 bg-red-50/70 px-5 py-4 text-center">
              <p className="text-[13px] font-semibold text-red-600">Scan failed</p>
              <p className="mt-1 text-xs text-red-400/80">Check your scanner configuration and try again.</p>
            </div>
          </div>
        )}

        {/* No skills found */}
        {!isLoading && scanStatus === "done" && tools.length === 0 && (
          <EmptyState
            icon="search"
            title="No skills found"
            description="Install some skills to get started, then refresh."
          />
        )}

        {/* Tab is empty */}
        {!isLoading && scanStatus === "done" && tools.length > 0 && currentSkills.length === 0 && activeTab && (
          <EmptyState
            icon="folder"
            title={`No ${TOOL_LABELS[activeTab] || activeTab} skills`}
            description="Install skills for this tool, then refresh."
          />
        )}

        {/* Skill cards */}
        {!isLoading && scanStatus === "done" && currentSkills.length > 0 && (
          <div className="p-5">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col gap-2.5" role="list">
                {currentSkills.map((skill, idx) => (
                  <div
                    key={skill.id}
                    style={{ "--delay": `${idx * 40}ms` } as React.CSSProperties}
                  >
                    <SkillCard
                      skill={skill}
                      enabled={enabledIds.has(skill.id)}
                      onToggle={toggleSkill}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ExportDialog open={activePanel === "export"} onClose={() => setActivePanel(null)} />
      <ImportDialog open={activePanel === "import"} onClose={() => setActivePanel(null)} />
      <SettingsPanel open={activePanel === "settings"} onClose={() => setActivePanel(null)} />
    </div>
  )
}

export default App
