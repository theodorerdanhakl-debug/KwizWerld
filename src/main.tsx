import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { initSession } from './store/session'
import { initTheme } from './store/theme'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/fredoka/latin-500.css'
import '@fontsource/fredoka/latin-600.css'
import './index.css'

initTheme()
initSession()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element missing')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
