import { createWriteStream } from "fs"
import { existsSync } from "fs"
import { basename } from "path"
import type { Archiver } from "archiver"

export class SkillExporter {
  async exportSkill(skillPath: string, outputPath: string): Promise<void> {
    const archiverModule = await import("archiver")
    const archiver = archiverModule.default as unknown as Archiver
    const archive = archiver("zip", { zlib: { level: 9 } })
    const stream = createWriteStream(outputPath)
    archive.pipe(stream)

    if (existsSync(skillPath)) {
      archive.directory(skillPath, basename(skillPath))
    }

    await archive.finalize()
  }
}
