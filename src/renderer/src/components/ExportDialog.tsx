import React, { useState } from "react"
import { useSkillStore } from "../store/skill-store"
import api from "../ipc-client"

interface ExportDialogProps {
  open: boolean
  onClose: () => void
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const { skills, enabledIds } = useSkillStore()
  const [label, setLabel] = useState("")
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  const enabledSkills = skills.filter((s) => enabledIds.has(s.id))

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = {
        label: label || undefined,
        skills: enabledSkills.map((s) => ({
          id: s.id,
          name: s.name,
          toolOrigin: s.toolOrigin,
          sourcePath: s.sourcePath
        }))
      }
      await api.exportSnapshot(data)
      setDone(true)
    } catch {
      // user cancelled dialog or error
    }
    setExporting(false)
  }

  const handleClose = () => {
    setLabel("")
    setDone(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {done ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Exported</h2>
            <p className="mt-2 text-sm text-gray-500">
              Snapshot with {enabledSkills.length} skills saved.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Export Snapshot</h2>
            <p className="mt-1 text-sm text-gray-500">
              {enabledSkills.length} skills will be included.
            </p>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600">
                Label (optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. My curated set"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {exporting ? "Saving..." : "Export"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ExportDialog
