export class OpenRouterClient {
  constructor(keysCsv = '') {
    this.keys = keysCsv
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
    this.idx = 0
    this.baseUrl = 'https://openrouter.ai/api/v1'
  }

  nextKey() {
    if (!this.keys.length) return null
    const key = this.keys[this.idx % this.keys.length]
    this.idx++
    return key
  }

  async chatCompletion({ model, messages, timeoutMs = 20000 }) {
    const apiKey = this.nextKey()
    if (!apiKey) {
      // No keys configured: return a minimal mock to keep local flow free
      return { choices: [{ message: { content: '/* mock: no OPENROUTER_API_KEYS set */' } }] }
    }
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const resp = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model, messages }),
        signal: controller.signal
      })
      if (!resp.ok) throw new Error(`OpenRouter error ${resp.status}`)
      return await resp.json()
    } catch (e) {
      if (e.name === 'AbortError') {
        const err = new Error('OpenRouter timeout')
        err.code = 'TIMEOUT'
        throw err
      }
      throw e
    } finally {
      clearTimeout(t)
    }
  }
}

