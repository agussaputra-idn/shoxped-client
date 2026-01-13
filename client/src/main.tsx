import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// PERBAIKAN: Gunakan BrowserRouter (Standar Website Modern)
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Gunakan BrowserRouter agar URL bersih tanpa tanda pagar # */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)