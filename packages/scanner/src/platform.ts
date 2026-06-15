export type OS = "darwin" | "win32" | "linux"

export function detectOS(): OS {
  return process.platform as OS
}
