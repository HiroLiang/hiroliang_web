import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from '@/App'
import { AppProviders } from '@/components/providers'
import { applyThemeMode, getInitialThemeMode } from '@/lib/theme'
import '@/index.css'

const useCustomFont = import.meta.env.VITE_USE_CUSTOM_FONT === 'true'
const initialThemeMode = getInitialThemeMode()

document.documentElement.dataset.useCustomFont = String(useCustomFont)
applyThemeMode(initialThemeMode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </HashRouter>
  </StrictMode>,
)
