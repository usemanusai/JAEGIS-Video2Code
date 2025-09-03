const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export async function uploadVideo(file: File): Promise<any> {
  const form = new FormData()
  form.append('file', file)
  let resp: Response
  try {
    resp = await fetch(`${base}/proxy/process`, { method: 'POST', body: form })
  } catch (e: any) {
    throw new Error('Network error while uploading. Please check your connection and retry.')
  }
  let json: any = {}
  try { json = await resp.json() } catch {}
  if (!resp.ok) {
    const msg = json?.message || json?.error || `Upload failed: ${resp.status}`
    throw new Error(String(msg))
  }
  return json
}

