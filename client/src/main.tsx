import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // (Dibutuhkan untuk <Link>)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// === INI BARIS BARU DARI LANGKAH 4 ===
// (Sudah diletakkan di atas bersama import lainnya)
import './i18n';
// ======================================

// === INI BARIS 15 ANDA YANG ERROR ===
// (Sekarang diletakkan SETELAH semua import)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false // (Setting umum yang bagus)
    }
  }
});

// Ini adalah bagian render, biarkan di paling bawah
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);