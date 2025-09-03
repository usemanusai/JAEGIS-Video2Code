import express from 'express'
import multer from 'multer'

const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_MB || '100', 10)
const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES } })
const router = express.Router()

router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'missing_file', message: 'No file provided', suggestion: 'Select a .mp4 file and try again' })
    const ct = req.file.mimetype || ''
    if (!ct.includes('mp4')) {
      return res.status(415).json({ error: 'unsupported_media_type', message: `Unsupported content-type: ${ct}`, suggestion: 'Only MP4 (H.264) is supported at this time' })
    }

    const form = new FormData()
    form.append('file', new Blob([req.file.buffer]), req.file.originalname)

    // Timeout for video-processor request
    const controller = new AbortController()
    const timeoutMs = parseInt(process.env.VIDEO_PROCESSOR_TIMEOUT_MS || '180000', 10)
    const to = setTimeout(() => controller.abort(), timeoutMs)

    // video-processor service name on docker-compose network
    const resp = await fetch('http://video-processor:5000/process', {
      method: 'POST',
      body: form,
      signal: controller.signal
    }).catch((e) => {
      if (e.name === 'AbortError') return { ok: false, status: 504, json: async () => ({ error: 'processor_timeout', message: 'Video processing timed out', suggestion: 'Try a shorter clip or reduce resolution' }) }
      throw e
    })
    clearTimeout(to)

    if (!resp || !('ok' in resp)) return res.status(502).json({ error: 'processor_unreachable', message: 'Video processor not reachable', suggestion: 'Ensure video-processor service is running' })

    let data
    try { data = await resp.json() } catch { data = { error: 'invalid_processor_response' } }
    return res.status(resp.status).json(data)
  } catch (e) {
    if (e instanceof multer.MulterError && e.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'file_too_large', message: `File exceeds ${MAX_UPLOAD_MB}MB limit`, suggestion: 'Upload a smaller clip or compress the video' })
    }
    console.error(e)
    res.status(500).json({ error: 'proxy_failed', message: 'Unexpected error while handling upload' })
  }
})

// Multer error handler fallback (in case error bubbles as middleware)
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'file_too_large', message: `File exceeds ${MAX_UPLOAD_MB}MB limit`, suggestion: 'Upload a smaller clip or compress the video' })
  }
  return res.status(500).json({ error: 'proxy_failed', message: 'Unexpected error' })
})

export default router

