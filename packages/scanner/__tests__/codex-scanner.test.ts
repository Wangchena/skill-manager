import { describe, it, expect, vi, beforeEach } from "vitest"
import { CodexScanner } from "../src/codex-scanner.js"

vi.mock("fs", () => ({
  existsSync: vi.fn()
}))

vi.mock("fs/promises", () => ({
  readdir: vi.fn(),
  readFile: vi.fn()
}))

describe("CodexScanner", () => {
  const scanner = new CodexScanner()

  it("should expose the tool name", () => {
    expect(scanner.name).toBe("Codex")
  })

  it("should return default paths for darwin", () => {
    const paths = scanner.defaultPaths("darwin")
    expect(paths.length).toBeGreaterThan(0)
    expect(paths[0]).toContain(".codex/skills")
  })

  it("should return default paths for win32", () => {
    const paths = scanner.defaultPaths("win32")
    expect(paths[0]).toContain(".codex\\skills")
  })

  it("should return empty array for non-existent directory", async () => {
    const { existsSync } = await import("fs")
    vi.mocked(existsSync).mockReturnValue(false)

    const result = await scanner.scan(["/nonexistent"])
    expect(result).toEqual([])
  })
})
