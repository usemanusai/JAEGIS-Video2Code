export function generateReact(analysis) {
  // Create a simple React component showing inferred summary
  const summary = (analysis?.llmSummary || '').replace(/`/g, '\\`')
  return `import React from 'react'\n\nexport default function GeneratedScreen(){\n  return (\n    <div style={{padding:16}}>\n      <h2>Generated UI</h2>\n      <p>LLM summary:</p>\n      <pre>${summary}</pre>\n      <button>Primary</button>\n      <input placeholder=\"Type here\" />\n    </div>\n  )\n}`
}

export function generateOpenAPI() {
  return `openapi: 3.0.0\ninfo:\n  title: VIDEO2CODE Generated API\n  version: 0.0.1\npaths:\n  /refine:\n    post:\n      summary: Refine code with LLM\n      requestBody:\n        content:\n          application/json:\n            schema:\n              type: object\n              properties:\n                artifact: { type: string }\n                code: { type: string }\n                prompt: { type: string }\n      responses:\n        '200':\n          description: OK\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  updatedCode: { type: string }\n`
}

export function generateNestJS() {
  return `import { Controller, Post, Body } from '@nestjs/common'\n\n@Controller('refine')\nexport class RefineController {\n  @Post()\n  refine(@Body() body: any) {\n    return { updatedCode: (body?.code || '') }\n  }\n}`
}

