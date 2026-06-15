import React, { useEffect, useState } from "react"
import { useSkillStore } from "./store/skill-store"
import TabBar from "./components/TabBar"
import SkillCard from "./components/SkillCard"
import SummaryBar from "./components/SummaryBar"
import EmptyState from "./components/EmptyState"
import RefreshButton from "./components/RefreshButton"

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
        </div>
      </header>

      {/* Summary */}
      <div className="px-6 py-3">
        <SummaryBar totalCount={totalCount} enabledCount={enabledCount} />
      </div>

      {/* Tabs */}
      <TabBar tools={tools} activeTab={activeTab} onTabChange={setActiveTab} />

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
              No skills found. Install some skills first.
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

        {!isLoading && scanStatus === "idle" && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-gray-400">
              Press Refresh to scan for skills.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
