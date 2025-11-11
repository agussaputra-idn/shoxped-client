/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },

  theme: {
    extend: {
      colors: {
        // === WARNA BARU UNTUK OPSI 2 ===
        // Warna Utama (Shopee)
        'primary': '#EE4D2D', 
        
        // Warna Aksen (TikTok)
        'secondary': '#0D9488', // Ini Cyan/Teal
        
        // Anda bisa tambahkan aksen Pink TikTok jika mau
        'accent-pink': '#FF0050' 
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      });
    })
    // Baris 'require('@tailwindcss/line-clamp')' sudah dihapus.
  ]
};