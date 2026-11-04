import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { revealWhenReady } from './BootLoader'
import { setFavicon } from './favicon'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

setFavicon()

// After the first render, so the first-view images exist to wait on.
requestAnimationFrame(revealWhenReady)
