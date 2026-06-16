import React from "react"
import { Code2, Sparkles, Terminal } from "lucide-react"

interface TabBarProps {
  tools: string[]
  activeTab: string
  onTabChange: (tool: string) => void
}

const TOOL_LABELS: Record<string, string> = {
  codex: "Codex",
  claude: "Claude",
  cursor: "Cursor"
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  codex: <Code2 className="h-[14px] w-[14px]" />,
  claude: <Sparkles className="h-[14px] w-[14px]" />,
  cursor: <Terminal className="h-[14px] w-[14px]" />
}

const TabBar: React.FC<TabBarProps> = ({ tools, activeTab, onTabChange }) => {
  if (tools.length === 0) return null

  return (
    <div className="flex gap-0.5" role="tablist">
      {tools.map((tool) => {
        const isActive = activeTab === tool
        return (
          <button
            key={tool}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tool)}
            className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
              isActive
                ? "bg-gray-100/90 text-gray-900 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.03)]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/80"
            }`}
          >
            {TOOL_ICONS[tool]}
            {TOOL_LABELS[tool] || tool}
          </button>
        )
      })}
    </div>
  )
}

export default TabBar
