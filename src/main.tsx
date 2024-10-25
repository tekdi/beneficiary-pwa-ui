import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '../src/components/common/i18n';
// import '/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
