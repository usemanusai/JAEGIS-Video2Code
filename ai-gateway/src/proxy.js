import express from 'express'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'missing file' })

    const form = new FormData()
    form.append('file', new Blob([req.file.buffer]), req.file.originalname)

    // video-processor service name on docker-compose network
    const resp = await fetch('http://video-processor:5000/process', {
      method: 'POST',
      body: form
    })
    const data = await resp.json()
    res.status(resp.status).json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'proxy_failed' })
  }
})

export default router

