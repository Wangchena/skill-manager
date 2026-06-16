import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../store/settings-store"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Override default scanner directories and enable/disable tools.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Codex skill path override
            </label>
            <input
              type="text"
              value={pathOverrides.codex || ""}
              onChange={(e) =>
                e.target.value
                  ? setPathOverride("codex", e.target.value)
                  : removePathOverride("codex")
              }
              placeholder="~/.codex/skills (default)"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Claude Code skill path override
            </label>
            <input
              type="text"
              value={pathOverrides.claude || ""}
              onChange={(e) =>
                e.target.value
                  ? setPathOverride("claude", e.target.value)
                  : removePathOverride("claude")
              }
              placeholder="~/.agents/skills (default)"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Cursor skill path override
            </label>
            <input
              type="text"
              value={pathOverrides.cursor || ""}
              onChange={(e) =>
                e.target.value
                  ? setPathOverride("cursor", e.target.value)
                  : removePathOverride("cursor")
              }
              placeholder="Cursor default paths (auto)"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
