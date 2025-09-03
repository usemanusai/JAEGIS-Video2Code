import assert from 'node:assert/strict'
import http from 'node:http'

const API_BASE = process.env.API_BASE || 'http://localhost:8080'

async function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${API_BASE}${path}`, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
  })
}

// Smoke test for ai-gateway health
;(async () => {
  const res = await get('/health')
  assert.equal(res.status, 200)
  const parsed = JSON.parse(res.body)
  assert.equal(parsed.ok, true)
  console.log('ai-gateway /health OK')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})

