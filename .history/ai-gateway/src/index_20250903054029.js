import express from 'express'
import proxy from './proxy.js'

const app = express()
app.use(express.json({ limit: '5mb' }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/proxy', proxy)

app.listen(8080, () => {
  console.log('AI Gateway listening on :8080')
})

