import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../store/settings-store"
import { X, Folder, Code2, Sparkles, Terminal } from "lucide-react"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

const TOOL_META: Record<string, { label: string; placeholder: string; icon: React.ReactNode }> = {
  codex: { label: "Codex", placeholder: "~/.codex/skills (default)", icon: <Code2 className="h-4 w-4" /> },
  claude: { label: "Claude", placeholder: "~/.agents/skills (default)", icon: <Sparkles className="h-4 w-4" /> },
  cursor: { label: "Cursor", placeholder: "Cursor default paths (auto)", icon: <Terminal className="h-4 w-4" /> }
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose }) => {
  const { pathOverrides, loaded, load, setPathOverride, removePathOverride, save } =
    useSettingsStore()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && !loaded) {
      load()
    }
  }, [open, loaded, load])

  if (!open) return null

  const handleSave = async () => {
    setSaving(true)
    await save()
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 animate-overlay-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="rounded-xl bg-white shadow-xl border border-gray-200/50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Override default scanner paths for each tool.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {(["codex", "claude", "cursor"] as const).map((tool) => {
              const meta = TOOL_META[tool]
              return (
                <div key={tool}>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <span className="text-gray-400">{meta.icon}</span>
                    {meta.label} path override
                  </label>
                  <input
                    type="text"
                    value={pathOverrides[tool] || ""}
                    onChange={(e) =>
                      e.target.value
                        ? setPathOverride(tool, e.target.value)
                        : removePathOverride(tool)
                    }
                    placeholder={meta.placeholder}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
