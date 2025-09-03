const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export async function uploadVideo(file: File): Promise<any> {
  const form = new FormData()
  form.append('file', file)
  const resp = await fetch(`${base}/proxy/process`, { method: 'POST', body: form })
  if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`)
  return resp.json()
}

