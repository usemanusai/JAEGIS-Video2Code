import fs from 'node:fs/promises'
import path from 'node:path'
import { OpenRouterClient } from './openrouter.js'

const FRAMES_DIR = '/data/frames'

export class OrchestratorService {
  constructor(keysCsv) {
    this.client = new OpenRouterClient(keysCsv)
  }

  async listFrames() {
    // naive read; assumes frames written by video-processor
    const files = await fs.readdir(FRAMES_DIR)
    return files.filter((f) => f.endsWith('.jpg')).map((f) => path.join(FRAMES_DIR, f))
  }

  async analyzeFrames() {
    const frames = await this.listFrames()
    if (!frames.length) return { ui: [], actions: [] }

    // Minimal prompt to comply with free-tier: describe UI elements (mock or real)
    const messages = [
      { role: 'system', content: 'You are a UI analyzer. Summarize buttons and inputs seen.' },
      { role: 'user', content: `Found ${frames.length} frames.` }
    ]
    const resp = await this.client.chatCompletion({ model: 'openai/gpt-4o-mini', messages })
    const content = resp?.choices?.[0]?.message?.content || ''
    return { ui: [{ screen: 0, components: [] }], actions: [], llmSummary: content }
  }

  async generateArtifacts() {
    // Stubbed initial generation; returns placeholder code per PRD
    const analysis = await this.analyzeFrames()
    const reactCode = `export default function Screen(){return <div>Generated UI (stub)</div>}`
    const openapi = `openapi: 3.0.0\ninfo:\n  title: Generated API\n  version: 0.0.1\npaths: {}`
    const backend = `// NestJS controller stub\nexport class AppController {}`
    return { analysis, reactCode, openapi, backend }
  }
}

