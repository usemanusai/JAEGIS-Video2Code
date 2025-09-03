import React, { useEffect, useState } from 'react'

export default function Results() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
    fetch(`${base}/results`).then(r => r.json()).then(setData).catch(() => setData({ error: true }))
  }, [])

  if (!data) return <div>Loading results...</div>
  if (data.error) return <div>Error fetching results.</div>

  return (
    <div>
      <h3>Generated Artifacts (stub)</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

