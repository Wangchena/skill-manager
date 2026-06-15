import React from "react"

interface SummaryBarProps {
  totalCount: number
  enabledCount: number
}

const SummaryBar: React.FC<SummaryBarProps> = ({ totalCount, enabledCount }) => {
  if (totalCount === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600">
      <span>
        <strong className="text-gray-900">{enabledCount}</strong> of{" "}
        <strong className="text-gray-900">{totalCount}</strong> skills enabled
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${totalCount > 0 ? (enabledCount / totalCount) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}

export default SummaryBar
