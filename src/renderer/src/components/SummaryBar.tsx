import React from "react"

interface SummaryBarProps {
  totalCount: number
  linkedCounts: Record<string, number>
}

const SummaryBar: React.FC<SummaryBarProps> = ({ totalCount, linkedCounts }) => {
  if (totalCount === 0) return null

  return (
    <div className="flex items-center gap-3 pb-3">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
        <span className="text-gray-900">{totalCount}</span>
        <span className="text-gray-400 font-normal">skills found</span>
      </div>
      {Object.entries(linkedCounts).map(([tool, count]) => (
        <span key={tool} className="inline-flex items-center gap-1 rounded-[4px] bg-gray-100/70 px-1.5 py-[1px] text-[10px] font-medium text-gray-500">
          {tool}: {count}
        </span>
      ))}
    </div>
  )
}

export default SummaryBar
