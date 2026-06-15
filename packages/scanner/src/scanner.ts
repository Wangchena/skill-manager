import type { SkillRecord, ScanOptions } from "./types.js"
import type { OS } from "./platform.js"

/**
 * Abstract scanner interface for discovering skills installed by AI coding tools.
 *
 * Each tool (Codex, Claude Code, Cursor, etc.) implements this interface
 * to parse its own skill metadata format and directory layout.
 */
export abstract class Scanner {
  /** Human-readable name of the tool (e.g. "Codex", "Claude Code") */
  abstract name: string

  /**
   * Returns the default scan paths for the given OS.
   * These are the directories where the tool stores its installed skills.
   */
  abstract defaultPaths(os: OS): string[]

  /**
   * Scan the given directories and return discovered skills.
   * Each scanner knows how to parse its own tool's metadata format.
   */
  abstract scan(paths: string[]): Promise<SkillRecord[]>
}
