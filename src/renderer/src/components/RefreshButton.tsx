import React from "react"

interface RefreshButtonProps {
  onClick: () => void
  loading: boolean
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
      {loading ? "Scanning..." : "Refresh"}
    </button>
  )
}

export default RefreshButton
