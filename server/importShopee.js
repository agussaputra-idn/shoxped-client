const fs = require('fs');
const csv = require('csv-parser');

console.log("=== SHOPEE DATA SAVER ===");

const results = [];
const filePath = './shopee.csv'; 
const outputPath = './products.json'; // File tujuan penyimpanan

if (!fs.existsSync(filePath)) {
    console.error("❌ File shopee.csv tidak ditemukan!");
    process.exit(1);
}

console.log("⏳ Sedang memproses 128.000+ data... (Mohon tunggu sebentar)");

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    // 1. Ambil ID dari kolom pertama
    const firstKey = Object.keys(row)[0]; 
    const cleanId = row['Merchant Product ID'] || row[firstKey];

    // 2. Format Harga (Hilangkan koma/titik desimal jika ada)
    let rawPrice = row['Price'] || '0';
    let cleanPrice = parseInt(rawPrice.replace(/[,.]/g, ''));

    // 3. Susun Data
    const produk = {
        id: cleanId,
        name: row['Merchant Product Name'],
        link: row['Product URL Mobile (encoded)'] || row['Product URL Web (encoded)'],
        image: row['Image URL'],
        price: cleanPrice,
        category: row['Category Name'] || 'Uncategorized',
        brand: row['Brand'] || 'No Brand'
    };

    // 4. Filter Data Valid
    if (produk.name && produk.link && produk.image) {
        results.push(produk);
    }
  })
  .on('end', () => {
    // SIMPAN KE FILE JSON
    try {
        console.log(`\n💾 Sedang menyimpan ke ${outputPath}...`);
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        
        console.log("✅ SUKSES!");
        console.log(`📦 ${results.length} Produk telah disimpan di file 'products.json'`);
        console.log("==========================================");
        console.log("👉 File ini siap dibaca oleh Server/API Shoxped.");
    } catch (err) {
        console.error("❌ Gagal menyimpan file:", err);
    }
  });