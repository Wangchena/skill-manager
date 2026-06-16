import React from "react"
import type { SkillRecord } from "../store/types"
import { Folder, Code2, Sparkles, Terminal, Wrench, Link2 } from "lucide-react"

interface SkillCardProps {
  skill: SkillRecord
  onLink: (skillPath: string, toolName: string) => void
  onUnlink: (skillPath: string, toolName: string) => void
  availableTools: string[]
}

const BUILTIN_TOOLS: Record<string, { label: string; icon: React.ReactNode }> = {
  codex: { label: "Codex", icon: <Code2 className="h-3.5 w-3.5" /> },
  claude: { label: "Claude", icon: <Sparkles className="h-3.5 w-3.5" /> },
  cursor: { label: "Cursor", icon: <Terminal className="h-3.5 w-3.5" /> }
}

function getToolConfig(tool: string): { label: string; icon: React.ReactNode } {
  return BUILTIN_TOOLS[tool] || { label: tool.charAt(0).toUpperCase() + tool.slice(1), icon: <Wrench className="h-3.5 w-3.5" /> }
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onLink, onUnlink, availableTools }) => {
  const isLinked = (tool: string) => skill.linkedTools.includes(tool)
  const isHome = (tool: string) => skill.homeTool === tool
  const isDisabled = (tool: string) => isHome(tool) // can't unlink home tool

  return (
    <div className="animate-slide-up rounded-[10px] border border-gray-200/70 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.03)] card-hover"
         style={{ animationDelay: "var(--delay, 0ms)" }}>
      <div className="flex items-center justify-between p-4 gap-3">
        {/* Left: skill info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold text-gray-900">
            {skill.name}
            {skill.homeTool && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-[4px] bg-gray-100 px-1.5 py-[1px] text-[10px] font-medium text-gray-500 align-middle">
                <Link2 className="h-[9px] w-[9px]" />
                {getToolConfig(skill.homeTool)?.label || skill.homeTool}
              </span>
            )}
          </h3>
          {skill.description && (
            <p className="mt-1 text-[13px]/5 text-gray-500 line-clamp-2">{skill.description}</p>
          )}
          <div className="mt-1.5 flex items-center gap-1.5">
            <Folder className="h-[10px] w-[10px] text-gray-300 flex-shrink-0" />
            <p className="truncate text-[11px] text-gray-400/70" title={skill.sourcePath}>
              {skill.sourcePath}
            </p>
          </div>
        </div>

        {/* Right: per-tool toggle buttons */}
        <div className="flex items-center gap-1 flex-shrink-0" role="group">
          {availableTools.map((tool) => {
            const config = getToolConfig(tool)
            const linked = isLinked(tool)
            const home = isHome(tool)
            const disabled = isDisabled(tool)
            return (
              <button
                key={tool}
                onClick={() => {
                  if (disabled) return
                  if (linked) onUnlink(skill.sourcePath, tool)
                  else onLink(skill.sourcePath, tool)
                }}
                disabled={disabled}
                title={`${linked ? "Linked to" : "Link to"} ${config?.label}${home ? " (home)" : ""}`}
                className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium transition-all active:scale-[0.95] ${
                  linked || home
                      ? home
                        ? "bg-blue-50/80 text-blue-600 cursor-not-allowed opacity-60"
                        : "bg-blue-50/80 text-blue-600 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.03)]"
                      : "bg-gray-50/80 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                {config?.icon}
                {config?.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SkillCard
