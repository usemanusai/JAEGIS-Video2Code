import assert from 'node:assert'
import { OpenRouterClient } from '../src/openrouter.js'
import { OrchestratorService } from '../src/orchestrator.js'

function testOpenRouterRotation() {
  const c = new OpenRouterClient('k1,k2')
  assert.equal(c.nextKey(), 'k1')
  assert.equal(c.nextKey(), 'k2')
  assert.equal(c.nextKey(), 'k1')
}

async function testOrchestratorGeneration() {
  const svc = new OrchestratorService('')
  // monkeypatch: pretend frames exist
  svc.listFrames = async () => ['/data/frames/f1.jpg', '/data/frames/f2.jpg', '/data/frames/f3.jpg']
  // monkeypatch: fake LLM JSON content (wrapped in code fences to test extractor)
  svc.client.chatCompletion = async () => ({ choices: [{ message: { content: '```json\n{"screens":[{"id":1,"components":[{"type":"button","label":"Submit"},{"type":"input","label":"Email"}]}],"actions":["click"]}\n```' } }] })
  const analysis = await svc.analyzeFrames()
  assert.ok(Array.isArray(analysis.ui))
  assert.ok(Array.isArray(analysis.actions))
  const artifacts = await svc.generateArtifacts()
  assert.ok(artifacts.reactCode.includes('<button>Submit</button>'))
  assert.ok(artifacts.openapi.includes('openapi: 3.0.0'))
  assert.ok(artifacts.backend.includes('@nestjs/common'))
}

async function main() {
  testOpenRouterRotation()
  await testOrchestratorGeneration()
  // Zip builder test
  await import('./download.test.mjs')
  console.log('AI Gateway tests passed')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

