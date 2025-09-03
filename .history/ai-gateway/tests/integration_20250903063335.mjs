import assert from 'node:assert'

async function uploadAndGenerate() {
  const videoPath = process.env.TEST_VIDEO || '/tmp/test.mp4'
  const base = 'http://localhost:8080'

  const buf = await Bun.file?.(videoPath)?.arrayBuffer?.().catch?.(() => null)
  let blob
  if (buf) {
    blob = new Blob([buf], { type: 'video/mp4' })
  } else {
    // fallback for Node without Bun; construct via fs
    const fs = await import('node:fs/promises')
    const data = await fs.readFile(videoPath)
    blob = new Blob([data], { type: 'video/mp4' })
  }

  const form = new FormData()
  form.append('file', blob, 'test.mp4')

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

