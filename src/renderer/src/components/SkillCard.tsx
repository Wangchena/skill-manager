import React, { useState } from "react"
import type { SkillRecord } from "../store/types"

interface SkillCardProps {
  skill: SkillRecord
  enabled: boolean
  onToggle: (id: string) => void
}

const TOOL_BADGES: Record<string, string> = {
  codex: "bg-blue-100 text-blue-700",
  claude: "bg-purple-100 text-purple-700",
  cursor: "bg-green-100 text-green-700"
}

const DESCRIPTION_LIMIT = 120

const SkillCard: React.FC<SkillCardProps> = ({ skill, enabled, onToggle }) => {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = skill.description.length > DESCRIPTION_LIMIT
  const displayDesc = expanded || !needsTruncation
    ? skill.description
    : skill.description.slice(0, DESCRIPTION_LIMIT) + "..."

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        enabled
          ? "border-gray-200 bg-white"
          : "border-gray-100 bg-gray-50 opacity-60"
      }`}
    >
      <span className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onToggle(skill.id)}
          className="peer sr-only"
          id={`toggle-${skill.id}`}
        />
        <label
          htmlFor={`toggle-${skill.id}`}
          className={`block h-5 w-9 cursor-pointer rounded-full transition-colors ${
            enabled ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? "translate-x-[18px]" : "translate-x-0.5"
            } mt-0.5`}
          />
        </label>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">{skill.name}</h3>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              TOOL_BADGES[skill.toolOrigin] || "bg-gray-100 text-gray-600"
            }`}
          >
            {skill.toolOrigin}
          </span>
        </div>

        {skill.description && (
          <p className="mt-1 text-xs text-gray-500">
            {displayDesc}
            {needsTruncation && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </p>
        )}

        <p className="mt-1 truncate text-xs text-gray-400" title={skill.sourcePath}>
          {skill.sourcePath}
        </p>
      </div>
    </div>
  )
}

export default SkillCard
