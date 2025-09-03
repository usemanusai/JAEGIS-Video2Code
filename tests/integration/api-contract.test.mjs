import assert from 'node:assert/strict'
import http from 'node:http'

const GATEWAY = process.env.API_BASE || 'http://localhost:8080'

async function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(payload))
    const req = http.request(
      GATEWAY + path,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } },
      (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body }))
      }
    )
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

;(async () => {
  const res = await postJson('/refine', { artifact: 'test', code: 'console.log(1)', prompt: 'no-op' })
  assert.equal(res.status, 200)
  const obj = JSON.parse(res.body)
  assert.ok('updatedCode' in obj)
  console.log('ai-gateway refine contract OK')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})

