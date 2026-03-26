const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

console.log("⏳ Sedang memuat database... (Tahan sebentar)");
let products = [];
try {
    const rawData = fs.readFileSync('./products.json', 'utf8');
    products = JSON.parse(rawData);
    console.log(`✅ DATABASE SIAP! Total: ${products.length.toLocaleString()} Produk.`);
} catch (err) {
    console.error("❌ ERROR FATAL: Database rusak!", err.message);
}

// === FUNGSI PENCARIAN (REVISI: LIMIT DIPERBESAR) ===
const handleSearch = (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : "";
    console.log(`🔎 SEARCH: "${query}"`);

    if (!query) return res.json([]);

    const results = products.filter(p => {
        const name = p.name ? p.name.toLowerCase() : "";
        const brand = p.brand ? p.brand.toLowerCase() : "";
        const cat = p.category ? p.category.toLowerCase() : "";
        return name.includes(query) || brand.includes(query) || cat.includes(query);
    });

    // 👉 JEBOL BATAS: Kirim sampai 2000 produk (Bukan 50 lagi)
    res.json(results.slice(0, 2000));
};

// === FUNGSI REKOMENDASI (REVISI: LIMIT DIPERBESAR) ===
const handleRecommendations = (req, res) => {
    const randomProducts = [];
    if (products.length > 0) {
        // 👉 JEBOL BATAS: Kirim 500 produk acak untuk halaman depan
        const limit = Math.min(500, products.length);
        for (let i = 0; i < limit; i++) {
            const r = Math.floor(Math.random() * products.length);
            randomProducts.push(products[r]);
        }
    }
    console.log(`🎁 REKOMENDASI: Mengirim ${randomProducts.length} produk.`);
    res.json(randomProducts);
};

app.get('/api/search', handleSearch);
app.get('/api/products', handleRecommendations);
app.get('/search', handleSearch);
app.get('/products', handleRecommendations);

app.listen(PORT, () => {
    console.log(`🚀 SERVER SHOXPED v3.0 (UNLIMITED) RUNNING ON PORT ${PORT}`);
});