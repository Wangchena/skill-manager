import React, { useState } from "react"
import { useSkillStore } from "../store/skill-store"
import api from "../ipc-client"
import { X, Upload, CheckCircle2, Tag } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onClose: () => void
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const { skills } = useSkillStore()
  const [label, setLabel] = useState("")
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  const enabledSkills = skills

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = {
        label: label || undefined,
        skills: enabledSkills.map((s) => ({
          id: s.id,
          name: s.name,
          linkedTools: s.linkedTools,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 animate-overlay-in" onClick={handleClose} />
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="rounded-xl bg-white shadow-xl border border-gray-200/50">
          {done ? (
            <>
              <div className="px-5 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="mt-3 text-sm font-semibold text-gray-900">Snapshot saved</h2>
                <p className="mt-1.5 text-xs text-gray-500">
                  {enabledSkills.length} skill{enabledSkills.length !== 1 ? "s" : ""} exported successfully.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                    <Upload className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Export snapshot</h2>
                    <p className="text-xs text-gray-500">
                      {enabledSkills.length} skill{enabledSkills.length !== 1 ? "s" : ""} will be exported
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  Label (optional)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. My curated set"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? "Saving..." : "Export"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportDialog
