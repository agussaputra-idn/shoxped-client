// Import paket
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Inisialisasi server
const app = express();
app.use(cors());

// Ambil KEDUA kunci dari file .env
const INVOLVE_API_KEY = process.env.MY_INVOLVE_ASIA_API_KEY;
const INvolve_API_SECRET = process.env.MY_INVOLVE_ASIA_API_SECRET; // Nama variabel diperbaiki

// Variabel untuk menyimpan token sementara kita
let currentAccessToken = null;

// --- LANGKAH 1: FUNGSI OTENTIKASI ---
const authenticate = async () => {
  console.log("Mencoba mendapatkan token sementara dari Involve Asia...");
  try {
    const data = new URLSearchParams();
    data.append('key', INVOLVE_API_KEY);
    data.append('secret', INvolve_API_SECRET); // Menggunakan variabel yang diperbaiki

    const response = await axios.post(
      'https://api.involve.asia/api/authenticate',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );

    currentAccessToken = response.data.data.token;
    console.log("✅✅✅ SUKSES OTENTIKASI! Token berhasil didapat. (dari .env) ✅✅✅");

  } catch (error) {
    console.error("❌❌❌ GAGAL OTENTIKASI (dari .env):", error.response ? error.response.data : error.message);
  }
};

// --- LANGKAH 2: FUNGSI PENCARIAN ---
app.get('/api/search', async (req, res) => {
  try {
    if (!currentAccessToken) {
      console.error("Error: Token belum siap. Coba restart server.");
      return res.status(500).json({ error: 'Server belum siap, token tidak ada.' });
    }
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword pencarian dibutuhkan' });
    }
    console.log(`Menerima permintaan pencarian untuk: ${keyword}`);
    const dataUntukInvolveAsia = {
      "filters[offer_name]": keyword,
      "filters[offer_country]": "Indonesia"
    };
    const response = await axios.post(
      "https://api.involve.asia/api/offers/all",
      dataUntukInvolveAsia,
      {
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
          'Accept': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error memanggil API offers:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Gagal mengambil data dari server' });
  }
});

// Jalankan server
const PORT = 8080;
app.listen(PORT, async () => {
  console.log(`Server proxy "Shoxped" berjalan di http://localhost:${PORT}`);
  await authenticate();
});