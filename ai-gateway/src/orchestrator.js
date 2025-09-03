import fs from 'node:fs/promises'
import path from 'node:path'
import { OpenRouterClient } from './openrouter.js'
import { generateReact, generateOpenAPI, generateNestJS } from './codegen.js'

const FRAMES_DIR = '/data/frames'
const MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free'

export class OrchestratorService {
  constructor(keysCsv) {
    this.client = new OpenRouterClient(keysCsv)
  }

  async listFrames() {
    const files = await fs.readdir(FRAMES_DIR).catch(() => [])
    return files.filter((f) => f.endsWith('.jpg')).map((f) => path.join(FRAMES_DIR, f))
  }

  buildPrompt(frames) {
    // Produce a compact prompt with file names and desired JSON schema for UI extraction
    const schema = `Return JSON {screens:[{id:number,components:[{type:string,label?:string}]}],actions:string[]}`
    return [
      { role: 'system', content: 'You extract UI components from provided screenshots.' },
      { role: 'user', content: `Frames (${frames.length}): ${frames.map((f) => path.basename(f)).join(', ')}` },
      { role: 'user', content: `Schema: ${schema}` }
    ]
  }

  async analyzeFrames() {
    const frames = await this.listFrames()
    if (!frames.length) return { ui: [], actions: [], llmSummary: 'No frames found' }

    const messages = this.buildPrompt(frames)
    const resp = await this.client.chatCompletion({ model: MODEL, messages })
    const content = resp?.choices?.[0]?.message?.content || ''

    // Best-effort: try to parse JSON in the reply; fallback to empty
    let parsed = { screens: [], actions: [] }
    try {
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      if (start >= 0 && end >= start) parsed = JSON.parse(content.slice(start, end + 1))
    } catch (err) {
      // If parsing fails, keep the safe empty structure
    }

    return { ui: parsed.screens || [], actions: parsed.actions || [], llmSummary: content }
  }

  async generateArtifacts() {
    const analysis = await this.analyzeFrames()
    const reactCode = generateReact(analysis)
    const openapi = generateOpenAPI(analysis)
    const backend = generateNestJS(analysis)
    return { analysis, reactCode, openapi, backend }
  }
}

