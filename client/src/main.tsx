import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// PERUBAHAN DISINI: Ganti BrowserRouter jadi HashRouter
import { HashRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Ganti tag pembungkusnya juga jadi HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)