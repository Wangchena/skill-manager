import React from "react"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onClick: () => void
  loading: boolean
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-[7px] p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
      title="Refresh"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
    </button>
  )
}

export default RefreshButton
