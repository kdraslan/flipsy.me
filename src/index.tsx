import '@/firebase/config' // Importing initializes Firebase as a side effect.
import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { trackError } from '@/firebase/tracking'
import Home from '@/routes/Home/Home'

window.addEventListener('error', (event) => {
  trackError(
    event.message || 'Unknown error',
    event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : 'unknown',
  )
})

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
)
