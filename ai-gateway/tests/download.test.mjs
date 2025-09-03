import assert from 'node:assert'
import { buildZipBuffer } from '../src/download.js'
import { OrchestratorService } from '../src/orchestrator.js'

// Basic unit-ish test for zip builder and route readiness
(async () => {
  // Monkeypatch orchestrator used by buildZipBuffer through app.js export
  const svc = new OrchestratorService('')
  svc.analyzeFrames = async () => ({ ui: [{id:1,components:[{type:'button',label:'Go'}]}], actions: [], llmSummary: 'ok' })
  svc.generateArtifacts = async () => ({
    analysis: await svc.analyzeFrames(),
    reactCode: "export default function X(){return <button>Go</button>}",
    openapi: "openapi: 3.0.0\ninfo:\n  title: t",
    backend: "import { Controller } from '@nestjs/common'"
  })
  // Inject monkey into the module singleton
  const appModule = await import('../src/app.js')
  appModule.orchestrator.generateArtifacts = svc.generateArtifacts

  const buf = await buildZipBuffer()
  assert.ok(buf && Buffer.isBuffer(buf) && buf.length > 100)
  console.log('download.zip build test passed')
})().catch((e)=>{console.error(e);process.exit(1)})

