import React from 'react'
import ReactDOM from 'react-dom/client'
import Upload from './Upload'

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>VIDEO2CODE</h1>
      <Upload />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

