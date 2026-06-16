import React from "react"
import { Search, FolderOpen, Package } from "lucide-react"

interface EmptyStateProps {
  icon: "search" | "folder" | "package"
  title: string
  description?: string
}

const ICON_MAP = {
  search: Search,
  folder: FolderOpen,
  package: Package
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  const Icon = ICON_MAP[icon]

  return (
    <div className="flex flex-col items-center justify-center py-36">
      <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gray-100/70 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.02)]">
        <Icon className="h-6 w-6 text-gray-400/80" />
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-[13px] text-gray-400">{description}</p>
      )}
    </div>
  )
}

export default EmptyState
