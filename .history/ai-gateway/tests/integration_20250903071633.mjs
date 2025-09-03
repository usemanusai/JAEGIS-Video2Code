import assert from 'node:assert'

async function readLocal(path) {
  const fs = await import('node:fs/promises')
  const data = await fs.readFile(path)
  return new Blob([data], { type: 'video/mp4' })
}

async function uploadAndGenerate() {
  // Inside compose network, target the running ai-gateway service
  const base = process.env.API_BASE || 'http://ai-gateway:8080'
  // Use mounted test video if provided; otherwise quick sample download route not used here
  const videoPath = process.env.TEST_VIDEO || '/data/uploads/sample.mp4'

  const blob = await readLocal(videoPath)
  const form = new FormData()
  form.append('file', blob, 'sample.mp4')

  const up = await fetch(`${base}/proxy/process`, { method: 'POST', body: form })
  assert.ok(up.ok, `upload failed: ${up.status}`)
  const upJson = await up.json()
  assert.ok(typeof upJson.frameCount === 'number' && upJson.frameCount > 0)

  const res = await fetch(`${base}/results`)
  assert.ok(res.ok, `results failed: ${res.status}`)
  const data = await res.json()
  assert.ok(data.reactCode && data.openapi && data.backend)
  return data
}

uploadAndGenerate()
  .then(() => console.log('Integration workflow passed'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

