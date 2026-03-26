const fs = require('fs');

console.log("🕵️‍♂️ SEDANG MENCARI EIGER DI DALAM GUDANG...");

try {
    const rawData = fs.readFileSync('./products.json', 'utf8');
    const products = JSON.parse(rawData);

    console.log(`✅ Total Data di JSON: ${products.length.toLocaleString()}`);

    // 1. CARI YANG NAMANYA MENGANDUNG "EIGER"
    const eigerItems = products.filter(p => 
        p.name && p.name.toLowerCase().includes('eiger')
    );

    console.log(`🔍 Ditemukan ${eigerItems.length} produk dengan nama 'Eiger'.`);

    if (eigerItems.length > 0) {
        console.log("\n👇 CONTOH DATA EIGER YANG TERSIMPAN:");
        console.log(JSON.stringify(eigerItems.slice(0, 3), null, 2));
    } else {
        console.log("\n❌ ANEH! Server bilang data penuh, tapi Eiger tidak ada.");
        console.log("👉 Mari kita cek 3 data acak yang MASUK terakhir:");
        console.log(JSON.stringify(products.slice(-3), null, 2));
    }

} catch (err) {
    console.error("❌ Gagal baca database: " + err.message);
}