import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Import Plugin PWA

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Konfigurasi PWA ditambahkan di sini
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Shoxped - Cek Harga Termurah',
        short_name: 'Shoxped',
        description: 'Aplikasi perbandingan harga Shopee vs TikTok Shop',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png', // Pastikan nanti file ini ada di folder public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png', // Pastikan nanti file ini ada di folder public
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // 3. Settingan lama Anda tetap aman di bawah ini
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
});