import React, { useEffect, useState } from "react"
import { useSettingsStore } from "../store/settings-store"
import { X, Plus, Trash2, Package, Code2, Sparkles, Terminal } from "lucide-react"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose, onSaved }) => {
  const { customTools, loaded, load, addCustomTool, removeCustomTool, save } =
    useSettingsStore()
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPath, setNewPath] = useState("")

  useEffect(() => {
    if (open && !loaded) {
      load()
    }
  }, [open, loaded, load])

  if (!open) return null

  const handleAdd = () => {
    const name = newName.trim().toLowerCase().replace(/\s+/g, "-")
    const path = newPath.trim()
    if (name && path) {
      addCustomTool(name, path)
      setNewName("")
      setNewPath("")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await save()
    setSaving(false)
    onSaved?.()
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
                Register custom tools and manage scanner paths.
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
          <div className="px-5 py-4 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Built-in tools info */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Built-in tools</label>
              <div className="space-y-2">
                {[
                  { name: "Codex", key: "codex", icon: <Code2 className="h-3.5 w-3.5" />, path: "~/.codex/skills" },
                  { name: "Claude", key: "claude", icon: <Sparkles className="h-3.5 w-3.5" />, path: "~/.agents/skills" },
                  { name: "Cursor", key: "cursor", icon: <Terminal className="h-3.5 w-3.5" />, path: "~/.cursor/skills" }
                ].map((tool) => (
                  <div key={tool.key} className="flex items-center gap-2 rounded-lg bg-gray-50/60 px-3 py-2 text-xs text-gray-500">
                    <span className="text-gray-400">{tool.icon}</span>
                    <span className="font-medium text-gray-700">{tool.name}</span>
                    <span className="text-gray-400 ml-auto">{tool.path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom tools */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Custom tools</label>

              {/* Add new tool form */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tool name (e.g. qodercli)"
                  className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="Skills path"
                  className="flex-[2] min-w-0 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim() || !newPath.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              {/* Custom tools list */}
              {customTools.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No custom tools registered.</p>
              ) : (
                <div className="space-y-1">
                  {customTools.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs"
                    >
                      <Package className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{tool.name}</span>
                      <span className="text-gray-400 truncate ml-2">{tool.path}</span>
                      <button
                        onClick={() => removeCustomTool(tool.name)}
                        className="ml-auto rounded-md p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                        title={`Remove ${tool.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
