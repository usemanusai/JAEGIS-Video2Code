import fs from 'node:fs/promises'
import path from 'node:path'
import { OpenRouterClient } from './openrouter.js'
import { generateReact, generateOpenAPI, generateNestJS } from './codegen.js'

const FRAMES_DIR = '/data/frames'
const MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free'
const MAX_ANALYSIS_FRAMES = parseInt(process.env.MAX_ANALYSIS_FRAMES || '12', 10)

export class OrchestratorService {
  constructor(keysCsv) {
    this.client = new OpenRouterClient(keysCsv)
  }

  async listFrames() {
    const files = await fs.readdir(FRAMES_DIR).catch(() => [])
    return files.filter((f) => f.endsWith('.jpg')).map((f) => path.join(FRAMES_DIR, f))
  }

  sampleFrames(files, max = MAX_ANALYSIS_FRAMES) {
    if (files.length <= max) return files
    const out = []
    // Always include first and last
    out.push(files[0])
    const slots = max - 2
    for (let i = 1; i <= slots; i++) {
      const idx = Math.round((i * (files.length - 1)) / (slots + 1))
      out.push(files[idx])
    }
    out.push(files[files.length - 1])
    // Ensure uniqueness and order
    return [...new Set(out)]
  }

  async toDataUrl(file) {
    const buf = await fs.readFile(file)
    const b64 = buf.toString('base64')
    return `data:image/jpeg;base64,${b64}`
  }

  async buildMessagesWithImages(frames) {
    const sampled = this.sampleFrames(frames)
    const schema = `Return JSON strictly matching {screens:[{id:number,components:[{type:string,label?:string}]}],actions:string[]}`
    const header = {
      role: 'system',
      content: [{ type: 'text', text: 'You are a UI analysis model. Extract UI components and actions from given screenshots.' }]
    }
    const userContent = [
      { type: 'text', text: `Analyze ${sampled.length} screenshots sampled from user flow. Follow the schema exactly and return ONLY JSON.` },
      { type: 'text', text: `Schema: ${schema}` }
    ]
    for (const f of sampled) {
      const url = await this.toDataUrl(f)
      userContent.push({ type: 'image_url', image_url: { url } })
    }
    const user = { role: 'user', content: userContent }
    return [header, user]
  }

  extractJsonFromContent(content) {
    if (!content || typeof content !== 'string') return { screens: [], actions: [] }
    let text = content.trim()
    // Remove markdown fences if present
    if (text.startsWith('```')) {
      const first = text.indexOf('\n')
      const lastFence = text.lastIndexOf('```')
      if (first >= 0 && lastFence > first) text = text.slice(first + 1, lastFence)
    }
    // Try to locate first {...} block
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end >= start) {
      try {
        return JSON.parse(text.slice(start, end + 1))
      } catch {
        // fallthrough
      }
    }
    return { screens: [], actions: [] }
  }

  async analyzeFrames() {
    const frames = await this.listFrames()
    if (!frames.length) return { ui: [], actions: [], llmSummary: 'No frames found' }

    const messages = await this.buildMessagesWithImages(frames)
    const resp = await this.client.chatCompletion({ model: MODEL, messages })
    const content = resp?.choices?.[0]?.message?.content || ''

    const parsed = this.extractJsonFromContent(content)

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

