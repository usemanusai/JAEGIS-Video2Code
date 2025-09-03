import React, { useEffect, useState } from 'react'
import CodeTabs, { type Artifacts } from './CodeTabs'

export default function Results() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
      const r = await fetch(`${base}/results`)
      if (!r.ok) {
        const txt = await r.text().catch(() => '')
        throw new Error(txt || `Failed: ${r.status}`)
      }
      const body = await r.json()
      setData(body)
    } catch (e: any) {
      setError(e?.message || 'Error fetching results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    const framesInfo = 'Analyzing up to 12 frames…'
    return (
      <div>
        <div>Analyzing results…</div>
        <div style={{ opacity: 0.8, fontSize: 12 }}>{framesInfo}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div style={{ color: 'crimson' }}>Error: {error}</div>
        <button onClick={load}>Retry</button>
      </div>
    )
  }

  if (!data) return <div>No results available.</div>

  const a: Artifacts = { reactCode: data.reactCode || '', openapi: data.openapi || '', backend: data.backend || '' }

  return (
    <div>
      <h3>Generated Artifacts</h3>
      <CodeTabs artifacts={a} />
    </div>
  )
}

