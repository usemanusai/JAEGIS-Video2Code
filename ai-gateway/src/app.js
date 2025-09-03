import express from 'express'
import proxy from './proxy.js'
import { OrchestratorService } from './orchestrator.js'
import downloadHandler from './download.js'

export const orchestrator = new OrchestratorService(process.env.OPENROUTER_API_KEYS || '')

export const app = express()
app.use(express.json({ limit: '5mb' }))

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

app.get('/download.zip', downloadHandler)

app.post('/refine', async (req, res) => {
  try {
    const { artifact, code, prompt } = req.body || {}
    const messages = [
      { role: 'system', content: 'You are a code editor. Modify the code as requested.' },
      { role: 'user', content: `Artifact: ${artifact}\nPrompt: ${prompt}\n\nCode:\n${code}` }
    ]
    const resp = await orchestrator.client.chatCompletion({ model: 'openai/gpt-4o-mini', messages })
    const updated = resp?.choices?.[0]?.message?.content || code
    res.json({ updatedCode: updated })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'refine_failed' })
  }
})

