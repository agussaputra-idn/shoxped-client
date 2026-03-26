const fs = require('fs');
const csv = require('csv-parser');

console.log("🕵️‍♂️ SEDANG MEMERIKSA FORMAT SEMUA FILE CSV...");

// Baca semua file di folder ini
fs.readdir('./', (err, files) => {
    if (err) return console.error("Gagal baca folder.");

    // Ambil yang akhiran .csv saja, TAPI jangan ambil shopee.csv (yang data lama)
    const csvFiles = files.filter(f => f.endsWith('.csv') && f !== 'shopee.csv');

    console.log(`🔎 Ditemukan ${csvFiles.length} file CSV baru.`);
    console.log("==================================================");

    if (csvFiles.length === 0) {
        console.log("❌ Tidak ada file CSV lain. Pindahkan file Sepatu/Tas/HP ke sini dulu!");
        return;
    }

    csvFiles.forEach(file => {
        const results = [];
        // Coba baca dengan pemisah titik koma (;)
        fs.createReadStream(file)
            .pipe(csv({ separator: ';' })) 
            .on('headers', (headers) => {
                console.log(`📂 FILE: ${file}`);
                console.log(`   Jumlah Kolom: ${headers.length}`);
                console.log(`   Header (Depan): [ ${headers.slice(0, 3).join(' | ')} ... ]`);
                console.log(`   Header (Tengah): ... [ ${headers.find(h => h.includes('line-clamp')) || headers.find(h => h.includes('name')) || '???'} ] ...`);
                console.log("--------------------------------------------------");
            });
    });
});