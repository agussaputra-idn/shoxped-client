import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// 1. IMPORT PROVIDER (Wajib pakai src/ agar tidak error path)
import { LanguageProvider } from 'src/context/LanguageContext'
import { AuthProvider } from 'src/context/authContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. BUNGKUS APP DENGAN PROVIDER */}
      {/* Urutan: AuthProvider -> LanguageProvider -> App */}
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)