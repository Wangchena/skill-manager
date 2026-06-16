export interface SkillRecord {
  /** Unique identifier derived from the skill directory name */
  id: string
  /** Display name of the skill (from SKILL.md frontmatter) */
  name: string
  /** Short description of what the skill does */
  description: string
  /** Absolute path to the skill's directory on disk (the actual location) */
  sourcePath: string
  /** Which tool(s) this skill is currently linked to (symlinked into) */
  linkedTools: string[]
  /** Which tool this skill physically belongs to (detected from its sourcePath) */
  homeTool?: string
  /** Format version of the skill's manifest, if detected */
  formatVersion?: string
}

export interface ScanOptions {
  /** Custom directory paths to scan instead of defaults */
  customPaths?: string[]
}
