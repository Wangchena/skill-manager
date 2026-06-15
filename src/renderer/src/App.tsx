import React, { useEffect, useState } from "react"
import type { ScanResult } from "../../main/scanner-orchestrator"

const App: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.api
      .scan()
      .then(setResult)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div className="flex h-screen flex-col bg-gray-50 p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Skill Manager</h1>
        <span className="text-sm text-gray-500">
          {result
            ? `${result.skills.length} skills found`
            : error
              ? `Error: ${error}`
              : "Scanning..."}
        </span>
      </header>
      <main className="flex-1">
        {/* Tab view and skill cards will be built in U4 */}
        <p className="text-gray-400">Scan your skills to get started.</p>
      </main>
    </div>
  )
}

export default App
