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
  svc.listFrames = async () => ['/data/frames/f1.jpg', '/data/frames/f2.jpg']
  // monkeypatch: fake LLM JSON content
  svc.client.chatCompletion = async () => ({ choices: [{ message: { content: '{"screens":[{"id":1,"components":[{"type":"button","label":"Submit"}]}],"actions":["click"]}' } }] })
  const analysis = await svc.analyzeFrames()
  assert.ok(Array.isArray(analysis.ui))
  assert.ok(Array.isArray(analysis.actions))
  const artifacts = await svc.generateArtifacts()
  assert.ok(artifacts.reactCode.includes('Generated UI'))
  assert.ok(artifacts.openapi.includes('openapi: 3.0.0'))
  assert.ok(artifacts.backend.includes('@nestjs/common'))
}

async function main() {
  testOpenRouterRotation()
  await testOrchestratorGeneration()
  console.log('AI Gateway tests passed')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

