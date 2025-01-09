import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import "./Utils/wdyr.js"; // Not needed in production. Uncomment for development.
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
