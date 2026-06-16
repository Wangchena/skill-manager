import React, { useState } from "react"
import type { SkillRecord } from "../store/types"
import { Folder, ChevronDown, ChevronUp } from "lucide-react"

interface SkillCardProps {
  skill: SkillRecord
  enabled: boolean
  onToggle: (id: string) => void
}

const TOOL_BADGE: Record<string, { label: string; color: string; dot: string }> = {
  codex: { label: "Codex", color: "bg-blue-50/70 text-blue-600", dot: "bg-blue-500" },
  claude: { label: "Claude", color: "bg-purple-50/70 text-purple-600", dot: "bg-purple-500" },
  cursor: { label: "Cursor", color: "bg-emerald-50/70 text-emerald-600", dot: "bg-emerald-500" }
}

const DESCRIPTION_LIMIT = 140

const SkillCard: React.FC<SkillCardProps> = ({ skill, enabled, onToggle }) => {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = skill.description.length > DESCRIPTION_LIMIT
  const displayDesc = expanded || !needsTruncation
    ? skill.description
    : skill.description.slice(0, DESCRIPTION_LIMIT) + "..."

  const badge = TOOL_BADGE[skill.toolOrigin] || { label: skill.toolOrigin, color: "bg-gray-50/70 text-gray-500", dot: "bg-gray-400" }

  return (
    <div
      role="listitem"
      className={`animate-slide-up rounded-[10px] border bg-white card-hover ${
        enabled
          ? "border-gray-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.03)]"
          : "border-gray-100/80 shadow-none"
      }`}
      style={{ animationDelay: "var(--delay, 0ms)" }}
    >
      {/* Left accent bar for enabled skills */}
      {enabled && (
        <div className="h-1 w-full rounded-t-[10px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
      )}

      <div className="flex items-start gap-3.5 p-4">
        {/* macOS-style toggle */}
        <button
          role="switch"
          aria-checked={enabled}
          aria-label={`Toggle ${skill.name}`}
          onClick={() => onToggle(skill.id)}
          className={`relative mt-0.5 inline-flex h-[22px] w-[38px] flex-shrink-0 cursor-pointer items-center rounded-full border-0 transition-all duration-200 ${
            enabled
              ? "bg-blue-500 shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.15)]"
              : "bg-gray-300 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.08)]"
          }`}
        >
          <span
            className={`toggle-knob block h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(0,0,0,0.06)] will-change-transform ${
              enabled ? "translate-x-[18px]" : "translate-x-[2px]"
            }`}
          />
        </button>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Name + badge row */}
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[13px] font-semibold text-gray-900 leading-snug">
              {skill.name}
            </h3>
            <span className={`inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[2px] text-[11px] font-medium leading-relaxed ${badge.color}`}>
              <span className={`inline-block h-[5px] w-[5px] rounded-full ${badge.dot} ${enabled ? "badge-dot-active" : ""}`} />
              {badge.label}
            </span>
          </div>

          {/* Description */}
          {skill.description && (
            <div className="text-[13px]/5 text-gray-500">
              <span>{displayDesc}</span>
              {needsTruncation && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-0.5 text-blue-500 hover:text-blue-600 transition-colors ml-0.5 font-medium align-baseline"
                >
                  {expanded ? (
                    <ChevronUp className="inline-block h-3 w-3" />
                  ) : (
                    <ChevronDown className="inline-block h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Source path */}
          <div className="flex items-center gap-1.5">
            <Folder className="h-[10px] w-[10px] text-gray-300 flex-shrink-0" />
            <p className="truncate text-[11px] text-gray-400/70" title={skill.sourcePath}>
              {skill.sourcePath}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillCard
