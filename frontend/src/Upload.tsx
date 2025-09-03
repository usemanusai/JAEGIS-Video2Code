import React, { useCallback, useState } from 'react'
import { uploadVideo } from './api'

export default function Upload() {
  const [status, setStatus] = useState<string>('idle')
  const [message, setMessage] = useState<string>('')

  const onFile = useCallback(async (file: File) => {
    try {
      setStatus('uploading')
      const res = await uploadVideo(file)
      setMessage(`Uploaded. Frames extracted: ${res.frameCount}`)
      setStatus('done')
    } catch (e: any) {
      setStatus('error')
      setMessage(e?.message || 'Upload failed')
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Upload</h2>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: '2px dashed #888', padding: 40, borderRadius: 8 }}
      >
        <p>Drag & drop .mp4 here or select a file</p>
        <input type="file" accept="video/mp4" onChange={onChange} />
      </div>
      <div style={{ marginTop: 12 }}>
        {status === 'uploading' && <span>Uploading and processing...</span>}
        {!!message && <div>{message}</div>}
      </div>
    </div>
  )
}

