import React, { useState } from "react"
import { useSkillStore } from "../store/skill-store"
import api from "../ipc-client"

interface ImportDialogProps {
  open: boolean
  onClose: () => void
}

interface ImportResult {
  matched: Array<{ id: string; name: string }>
  unmatched: Array<{ id: string; name: string }>
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose }) => {
  const { skills, setEnabledIds } = useSkillStore()
  const [result, setResult] = useState<ImportResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleImport = async () => {
    setImporting(true)
    setError(null)
    try {
      const data = (await api.importSnapshot()) as {
        skills?: Array<{ id: string; name: string }>
      } | null

      if (!data || !data.skills) {
        setImporting(false)
        return
      }

      const installedIds = new Set(skills.map((s) => s.id))
      const matched: Array<{ id: string; name: string }> = []
      const unmatched: Array<{ id: string; name: string }> = []

      for (const skill of data.skills) {
        if (installedIds.has(skill.id)) {
          matched.push(skill)
        } else {
          unmatched.push(skill)
        }
      }

      setResult({ matched, unmatched })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed")
    }
    setImporting(false)
  }

  const handleApply = () => {
    if (result) {
      setEnabledIds(result.matched.map((s) => s.id))
    }
    handleClose()
  }

  const handleClose = () => {
    setResult(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Import Snapshot</h2>

        {!result && !error && (
          <>
            <p className="mt-1 text-sm text-gray-500">
              Select a snapshot.json file to import.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {importing ? "Opening..." : "Choose file"}
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <p className="mt-2 text-sm text-gray-500">
              {result.matched.length} skills matched,{" "}
              {result.unmatched.length} unavailable.
            </p>

            {result.unmatched.length > 0 && (
              <div className="mt-3 rounded-md bg-yellow-50 p-3">
                <p className="text-xs font-medium text-yellow-800">
                  Unavailable skills:
                </p>
                <ul className="mt-1 list-inside list-disc text-xs text-yellow-700">
                  {result.unmatched.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 rounded-md bg-red-50 p-3">
            <p className="text-xs text-red-600">{error}</p>
            <button
              onClick={handleClose}
              className="mt-3 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportDialog
