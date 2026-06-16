import React from "react"

interface SummaryBarProps {
  totalCount: number
  enabledCount: number
}

const SummaryBar: React.FC<SummaryBarProps> = ({ totalCount, enabledCount }) => {
  if (totalCount === 0) return null

  const pct = Math.round((enabledCount / totalCount) * 100)
  const disabledCount = totalCount - enabledCount

  return (
    <div className="flex items-center gap-3">
      {/* Stat pills */}
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
        <span className="text-gray-900">{enabledCount}</span>
        <span className="text-gray-300">/</span>
        <span>{totalCount}</span>
        <span className="text-gray-400 font-normal">enabled</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200/60">
        <div
          className="h-full rounded-full animate-progress"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? "linear-gradient(90deg, #22c55e, #16a34a)"
              : "linear-gradient(90deg, #3b82f6, #2563eb)"
          }}
        />
      </div>

      <span className="text-[11px] text-gray-400 font-medium tabular-nums">{pct}%</span>
    </div>
  )
}

export default SummaryBar
