import assert from 'node:assert'

async function readLocal(path) {
  const fs = await import('node:fs/promises')
  const data = await fs.readFile(path)
  return new Blob([data], { type: 'video/mp4' })
}

async function downloadSample(url) {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`download failed: ${resp.status}`)
  const ab = await resp.arrayBuffer()
  return new Blob([ab], { type: 'video/mp4' })
}

async function uploadAndGenerate() {
  const base = process.env.API_BASE || 'http://ai-gateway:8080'
  const sample = process.env.SAMPLE_URL || 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
  const testVideo = process.env.TEST_VIDEO

  let blob
  if (testVideo) {
    blob = await readLocal(testVideo)
  } else {
    blob = await downloadSample(sample)
  }

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
  // verify download.zip exists and is a zip
  const zipRes = await fetch(`${base}/download.zip`)
  assert.ok(zipRes.ok, `download.zip failed: ${zipRes.status}`)
  const ctype = zipRes.headers.get('content-type') || ''
  assert.ok(ctype.includes('application/zip'))

}

uploadAndGenerate()
  .then(() => console.log('Integration workflow passed'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

