function renderComponent(c){
  const type=(c?.type||'').toLowerCase()
  const label=c?.label||''
  switch(type){
    case 'button': return `<button>${label||'Button'}</button>`
    case 'input': return `<input placeholder="${label||'Input'}" />`
    case 'text': return `<p>${label||'Text'}</p>`
    case 'label': return `<label>${label||'Label'}</label>`
    default: return `<div>${label||type||'Component'}</div>`
  }
}

export function generateReact(analysis) {
  const summary = (analysis?.llmSummary || '').replace(/`/g, '\\`')
  const screens = Array.isArray(analysis?.ui) ? analysis.ui : []
  const blocks = screens.map((s)=>{
    const comps = (s?.components||[]).map(renderComponent).join('\n        ')
    return `<section style={{marginBottom:16}}><h3>Screen ${s?.id ?? ''}</h3>\n        ${comps}\n      </section>`
  }).join('\n      ')
  return `import React from 'react'\n\nexport default function GeneratedScreen(){\n  return (\n    <div style={{padding:16}}>\n      <h2>Generated UI</h2>\n      <details open><summary>LLM summary</summary>\n        <pre>${summary}</pre>\n      </details>\n      ${blocks || '<p>No components detected.</p>'}\n    </div>\n  )\n}`
}

export function generateOpenAPI() {
  return `openapi: 3.0.0\ninfo:\n  title: VIDEO2CODE Generated API\n  version: 0.0.1\npaths:\n  /refine:\n    post:\n      summary: Refine code with LLM\n      requestBody:\n        content:\n          application/json:\n            schema:\n              type: object\n              properties:\n                artifact: { type: string }\n                code: { type: string }\n                prompt: { type: string }\n      responses:\n        '200':\n          description: OK\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  updatedCode: { type: string }\n`
}

export function generateNestJS() {
  return `import { Controller, Post, Body } from '@nestjs/common'\n\n@Controller('refine')\nexport class RefineController {\n  @Post()\n  refine(@Body() body: any) {\n    return { updatedCode: (body?.code || '') }\n  }\n}`
}

