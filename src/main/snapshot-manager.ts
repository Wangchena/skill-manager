import { readFile, writeFile } from "fs/promises"

interface SnapshotData {
  version: number
  created_at: string
  label?: string
  skills: Array<{
    id: string
    name: string
    toolOrigin: string
    sourcePath: string
  }>
}

export class SnapshotManager {
  async exportSnapshot(filePath: string, data: unknown): Promise<void> {
    const snapshot: SnapshotData = {
      version: 1,
      created_at: new Date().toISOString(),
      ...(data as Partial<SnapshotData>)
    }
    await writeFile(filePath, JSON.stringify(snapshot, null, 2), "utf-8")
  }

  async importSnapshot(filePath: string): Promise<SnapshotData> {
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw) as SnapshotData
    if (!data.version || !Array.isArray(data.skills)) {
      throw new Error("Invalid snapshot format")
    }
    return data
  }
}
