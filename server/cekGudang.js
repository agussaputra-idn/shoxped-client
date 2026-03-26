const fs = require('fs');

console.log("🕵️‍♂️ SEDANG MELAKUKAN AUDIT STOK...");

try {
    const rawData = fs.readFileSync('./products.json', 'utf8');
    const products = JSON.parse(rawData);

    console.log(`\n✅ TOTAL PRODUK TERDATA: ${products.length.toLocaleString()} Item`);
    console.log("========================================");

    // 1. HITUNG KATEGORI TERBANYAK
    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'Tanpa Kategori';
        categories[cat] = (categories[cat] || 0) + 1;
    });

    // Urutkan dari yang terbanyak
    const sortedCats = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15); // Ambil Top 15

    console.log("📊 TOP 15 KATEGORI YANG ADA DI GUDANG:");
    sortedCats.forEach(([cat, count], index) => {
        console.log(`${index + 1}. ${cat} (${count.toLocaleString()} produk)`);
    });

    console.log("\n========================================");
    console.log("🎲 5 CONTOH PRODUK ACAK DARI TENGAH TUMPUKAN:");
    for (let i = 0; i < 5; i++) {
        // Ambil acak
        const randomIdx = Math.floor(Math.random() * products.length);
        console.log(`- ${products[randomIdx].name}`);
    }

} catch (err) {
    console.error("❌ Gagal membaca file products.json");
}