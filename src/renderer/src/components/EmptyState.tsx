import React from "react"

interface EmptyStateProps {
  toolName: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ toolName }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-sm text-gray-400">No skills found for {toolName}.</p>
      <p className="mt-1 text-xs text-gray-300">
        Install some skills first, then refresh.
      </p>
    </div>
  )
}

export default EmptyState
