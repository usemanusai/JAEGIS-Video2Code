import React from 'react'
import Results from './Results'

export default function Workspace() {
  const base = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080'
  const downloadAll = async () => {
    const resp = await fetch(`${base}/download.zip`)
    if (!resp.ok) return alert('Download failed')
    const blob = await resp.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const ts = new Date().toISOString().replace(/[:.]/g,'').slice(0,13)
    a.href = url
    a.download = `video2code-artifacts-${ts}.zip`
    a.click()
  }
  return (
    <div style={{ padding: 24 }}>
      <h2>Workspace</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={downloadAll}>Download All</button>
      </div>
      <Results />
    </div>
  )
}

