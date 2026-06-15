import React from "react"

interface TabBarProps {
  tools: string[]
  activeTab: string
  onTabChange: (tool: string) => void
}

const TOOL_LABELS: Record<string, string> = {
  codex: "Codex",
  claude: "Claude Code",
  cursor: "Cursor"
}

const TabBar: React.FC<TabBarProps> = ({ tools, activeTab, onTabChange }) => {
  if (tools.length === 0) return null

  return (
    <div className="flex gap-1 border-b border-gray-200" role="tablist">
      {tools.map((tool) => (
        <button
          key={tool}
          role="tab"
          aria-selected={activeTab === tool}
          onClick={() => onTabChange(tool)}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tool
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {TOOL_LABELS[tool] || tool}
        </button>
      ))}
    </div>
  )
}

export default TabBar
