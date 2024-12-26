import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import "./Utils/wdyr.js"; // Not needed in production. Uncomment for development.
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
