import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Upload from './Upload'
import Workspace from './Workspace'

const router = createBrowserRouter([
  { path: '/', element: <Upload /> },
  { path: '/workspace', element: <Workspace /> }
])

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>VIDEO2CODE</h1>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/">Upload</Link> | <Link to="/workspace">Workspace</Link>
      </nav>
      <RouterProvider router={router} />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

