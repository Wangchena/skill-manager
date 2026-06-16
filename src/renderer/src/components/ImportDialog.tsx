import React, { useState } from "react"
import { useSkillStore } from "../store/skill-store"
import api from "../ipc-client"
import { X, Download, CheckCircle2, AlertTriangle, FileDown } from "lucide-react"

interface ImportDialogProps {
  open: boolean
  onClose: () => void
}

interface ImportResult {
  matched: Array<{ id: string; name: string }>
  unmatched: Array<{ id: string; name: string }>
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose }) => {
  const { skills, scan } = useSkillStore()
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

  const handleApply = async () => {
    if (result) {
      // Re-scan will pick up any newly linked skills
      await scan()
    }
    handleClose()
  }

  const handleClose = () => {
    setResult(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 animate-overlay-in" onClick={handleClose} />
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="rounded-xl bg-white shadow-xl border border-gray-200/50">
          {!result && !error && (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                    <Download className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Import snapshot</h2>
                    <p className="text-xs text-gray-500">Choose a snapshot.json file to import</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  {importing ? "Opening..." : "Choose file"}
                </button>
              </div>
            </>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${result.unmatched.length > 0 ? 'bg-amber-50' : 'bg-blue-50'}`}>
                    {result.unmatched.length > 0
                      ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      : <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    }
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Import results</h2>
                    <p className="text-xs text-gray-500">
                      {result.matched.length} matched, {result.unmatched.length} unavailable
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
                {result.unmatched.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3.5 py-3">
                    <p className="text-xs font-medium text-amber-800">
                      Unavailable skills:
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {result.unmatched.map((s) => (
                        <li key={s.id} className="text-xs text-amber-700 flex items-center gap-1.5">
                          <span className="inline-block h-1 w-1 rounded-full bg-amber-400" />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-amber-600">
                      Install the missing skills first to include them.
                    </p>
                  </div>
                )}

                {result.unmatched.length === 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 px-3.5 py-3">
                    <p className="text-xs text-blue-700">
                      All {result.matched.length} skill{result.matched.length !== 1 ? "s" : ""} are available and ready to apply.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </>
          )}

          {error && (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Import failed</h2>
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
                <div className="rounded-lg border border-red-200 bg-red-50/50 px-3.5 py-3">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
              <div className="flex items-center justify-end border-t border-gray-100 px-5 py-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportDialog
