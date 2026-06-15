export interface SkillRecord {
  /** Unique identifier derived from source path */
  id: string
  /** Display name of the skill */
  name: string
  /** Short description of what the skill does */
  description: string
  /** Absolute path to the skill's directory on disk */
  sourcePath: string
  /** Which AI tool this skill belongs to (e.g. "codex", "claude", "cursor") */
  toolOrigin: string
  /** Format version of the skill's manifest, if detected */
  formatVersion?: string
}

export interface ScanOptions {
  /** Custom directory paths to scan instead of defaults */
  customPaths?: string[]
}
