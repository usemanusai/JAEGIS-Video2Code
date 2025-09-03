import JSZip from 'jszip'
import { orchestrator } from './app.js'

export async function buildZipBuffer() {
  const zip = new JSZip()
  const artifacts = await orchestrator.generateArtifacts()
  const stamp = new Date().toISOString().replace(/[:T]/g,'-').slice(0,16)
  const model = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free'
  const readme = `VIDEO2CODE artifacts\nGenerated: ${stamp}Z\nModel: ${model}\nFiles:\n- react/GeneratedScreen.jsx\n- api/openapi.yaml\n- backend/refine.controller.ts\n- analysis/analysis.json\n`

  zip.file('react/GeneratedScreen.jsx', artifacts.reactCode || '')
  zip.file('api/openapi.yaml', artifacts.openapi || '')
  zip.file('backend/refine.controller.ts', artifacts.backend || '')
  zip.file('analysis/analysis.json', JSON.stringify(artifacts.analysis || {}, null, 2))
  zip.file('README.txt', readme)

  return zip.generateAsync({ type: 'nodebuffer' })
}

export default async function downloadHandler(_req, res) {
  try {
    const buf = await buildZipBuffer()
    const filename = `video2code-artifacts-${new Date().toISOString().replace(/[:.]/g,'').slice(0,13)}.zip`
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.send(buf)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'zip_failed' })
  }
}

