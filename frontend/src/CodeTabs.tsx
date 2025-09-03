import React, { useMemo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export type Artifacts = {
  reactCode: string
  openapi: string
  backend: string
}

type TabKey = 'frontend' | 'backend' | 'api'

function codeFor(tab: TabKey, a: Artifacts): string {
  switch (tab) {
    case 'frontend':
      return a.reactCode
    case 'backend':
      return a.backend
    case 'api':
      return a.openapi
  }
}

export default function CodeTabs({ artifacts }: { artifacts: Artifacts }) {
  const [active, setActive] = useState<TabKey>('frontend')
  const lang = useMemo(() => (active === 'api' ? 'yaml' : 'tsx'), [active])
  const code = codeFor(active, artifacts)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    alert('Copied to clipboard')
  }

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = active === 'api' ? 'openapi.yaml' : active === 'backend' ? 'controller.ts' : 'Screen.tsx'
    a.click()
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setActive('frontend')}>Frontend</button>{' '}
        <button onClick={() => setActive('backend')}>Backend</button>{' '}
        <button onClick={() => setActive('api')}>API Spec</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={copy}>Copy</button>{' '}
        <button onClick={download}>Download</button>
      </div>
      <SyntaxHighlighter language={lang} style={oneDark} customStyle={{ maxHeight: 480 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

