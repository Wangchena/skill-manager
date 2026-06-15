import { describe, it, expect, vi } from "vitest"
import { ClaudeScanner } from "../src/claude-scanner.js"

vi.mock("fs", () => ({
  existsSync: vi.fn()
}))

vi.mock("fs/promises", () => ({
  readdir: vi.fn(),
  readFile: vi.fn()
}))

describe("ClaudeScanner", () => {
  const scanner = new ClaudeScanner()

  it("should expose the tool name", () => {
    expect(scanner.name).toBe("Claude Code")
  })

  it("should return default paths", () => {
    const paths = scanner.defaultPaths("darwin")
    expect(paths[0]).toContain(".agents/skills")
  })

  it("should return empty array for non-existent directory", async () => {
    const { existsSync } = await import("fs")
    vi.mocked(existsSync).mockReturnValue(false)

    const result = await scanner.scan(["/nonexistent"])
    expect(result).toEqual([])
  })
})
