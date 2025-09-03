import assert from 'node:assert'

// Simple smoke tests for error-paths in the gateway proxy
(async () => {
  const base = process.env.API_BASE || 'http://ai-gateway:8080'

  // wrong type (simulate by sending text/plain)
  {
    const blob = new Blob([new TextEncoder().encode('hi')], { type: 'text/plain' })
    const form = new FormData()
    form.append('file', blob, 'note.txt')
    const r = await fetch(`${base}/proxy/process`, { method: 'POST', body: form })
    assert.equal(r.status === 415 || r.status === 400, true)
  }

  // missing file
  {
    const form = new FormData()
    const r = await fetch(`${base}/proxy/process`, { method: 'POST', body: form })
    assert.equal(r.status, 400)
  }

  console.log('upload error-path tests passed')
})().catch((e)=>{console.error(e);process.exit(1)})

