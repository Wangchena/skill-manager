import { readFile } from "fs/promises"
import { join, dirname, relative, basename } from "path"
import { existsSync } from "fs"
import { createWriteStream } from "fs"
import { createGzip } from "zlib"
import { pipeline } from "stream/promises"
import archiver from "archiver"

export class SkillExporter {
  async exportSkill(skillPath: string, outputPath: string): Promise<void> {
    const archive = archiver("zip", { zlib: { level: 9 } })
    const stream = createWriteStream(outputPath)
    archive.pipe(stream)

    if (existsSync(skillPath)) {
      archive.directory(skillPath, basename(skillPath))
    }

    await archive.finalize()
  }
}
