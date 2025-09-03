import express from 'express'
import proxy from './proxy.js'
import { OrchestratorService } from './orchestrator.js'

const app = express()
app.use(express.json({ limit: '5mb' }))

const orchestrator = new OrchestratorService(process.env.OPENROUTER_API_KEYS || '')

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/proxy', proxy)

app.get('/results', async (_req, res) => {
  try {
    const artifacts = await orchestrator.generateArtifacts()
    res.json(artifacts)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'generation_failed' })
  }
})

app.listen(8080, () => {
  console.log('AI Gateway listening on :8080')
})

