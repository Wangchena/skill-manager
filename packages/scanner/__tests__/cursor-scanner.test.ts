import { describe, it, expect, vi } from "vitest"
import { CursorScanner } from "../src/cursor-scanner.js"

vi.mock("fs", () => ({
  existsSync: vi.fn()
}))

vi.mock("fs/promises", () => ({
  readdir: vi.fn(),
  readFile: vi.fn()
}))

describe("CursorScanner", () => {
  const scanner = new CursorScanner()

  it("should expose the tool name", () => {
    expect(scanner.name).toBe("Cursor")
  })

  it("should return default paths for darwin", () => {
    const paths = scanner.defaultPaths("darwin")
    expect(paths[0]).toContain("Cursor")
  })

  it("should return empty array for non-existent directory", async () => {
    const { existsSync } = await import("fs")
    vi.mocked(existsSync).mockReturnValue(false)

    const result = await scanner.scan(["/nonexistent"])
    expect(result).toEqual([])
  })
})
