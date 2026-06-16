import React, { useEffect, useState } from "react"
import { useSkillStore } from "./store/skill-store"
import TabBar from "./components/TabBar"
import SkillCard from "./components/SkillCard"
import SummaryBar from "./components/SummaryBar"
import EmptyState from "./components/EmptyState"
import RefreshButton from "./components/RefreshButton"
import ExportDialog from "./components/ExportDialog"
import ImportDialog from "./components/ImportDialog"
import SettingsPanel from "./components/SettingsPanel"

type ActivePanel = "export" | "import" | "settings" | null

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

  useEffect(() => {
    scan()
  }, [scan])

  const tools = [...new Set(skills.map((s) => s.toolOrigin))].sort()

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
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Skill Manager</h1>
          <p className="text-xs text-gray-400">Manage AI coding tool skills</p>
        </div>
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <>
              <button
                onClick={() => setActivePanel("export")}
                className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Export
              </button>
              <button
                onClick={() => setActivePanel("import")}
                className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Import
              </button>
              <span className="h-4 w-px bg-gray-200" />
              <button
                onClick={enableAll}
                className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Enable all
              </button>
              <button
                onClick={disableAll}
                className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Disable all
              </button>
            </>
          )}
          <RefreshButton onClick={scan} loading={isLoading} />
          <button
            onClick={() => setActivePanel("settings")}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Settings"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="px-6 py-3">
        <SummaryBar totalCount={totalCount} enabledCount={enabledCount} />
      </div>

      {/* Tabs */}
      <div className="px-6">
        <TabBar tools={tools} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            <span className="ml-2 text-sm text-gray-400">Scanning skills...</span>
          </div>
        )}

        {!isLoading && scanStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-red-500">Failed to scan skills.</p>
          </div>
        )}

        {!isLoading && scanStatus === "done" && tools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-gray-400">
              No skills found. Install some skills first, then refresh.
            </p>
          </div>
        )}

        {!isLoading && scanStatus === "done" && currentSkills.length === 0 && activeTab && (
          <EmptyState toolName={activeTab} />
        )}

        {!isLoading && scanStatus === "done" && currentSkills.length > 0 && (
          <div className="flex flex-col gap-2" role="list">
            {currentSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                enabled={enabledIds.has(skill.id)}
                onToggle={toggleSkill}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ExportDialog
        open={activePanel === "export"}
        onClose={() => setActivePanel(null)}
      />
      <ImportDialog
        open={activePanel === "import"}
        onClose={() => setActivePanel(null)}
      />
      <SettingsPanel
        open={activePanel === "settings"}
        onClose={() => setActivePanel(null)}
      />
    </div>
  )
}

export default App
