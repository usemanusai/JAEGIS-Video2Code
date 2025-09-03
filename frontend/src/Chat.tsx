import React, { useState } from 'react'

export default function Chat({
  artifact,
  code,
  onUpdate
}: {
  artifact: 'frontend' | 'backend' | 'api'
  code: string
  onUpdate: (updatedCode: string) => void
}) {
  const [prompt, setPrompt] = useState('Make the button blue')
  const [busy, setBusy] = useState(false)
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

  const send = async () => {
    try {
      setBusy(true)
      const body = { artifact, code, prompt }
      const resp = await fetch(`${base}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await resp.json()
      if (json?.updatedCode) onUpdate(json.updatedCode)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Chat Refinement</h4>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        style={{ width: '100%', resize: 'vertical' }}
      />
      <div>
        <button onClick={send} disabled={busy}>
          {busy ? 'Refining...' : 'Refine Code'}
        </button>
      </div>
    </div>
  )
}

