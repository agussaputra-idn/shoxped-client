const fs = require('fs');
const csv = require('csv-parser');

console.log("=== MENGECEK NAMA KOLOM ASLI (SEPATU PRIA) ===");

// Pastikan file 'Sepatu Pria.csv' sudah ada di dalam folder server!
const namaFile = './Sepatu Pria.csv';

if (!fs.existsSync(namaFile)) {
    console.error(`❌ ERROR: File '${namaFile}' tidak ditemukan di folder server!`);
    console.error("👉 Pastikan file sudah dipindahkan dan namanya sama persis.");
    process.exit(1);
}

fs.createReadStream(namaFile)
  .pipe(csv())
  .on('data', (row) => {
    // Kita cetak SEMUA nama kolom yang ditemukan di baris pertama
    console.log("✅ NAMA KOLOM DITEMUKAN:");
    console.log(Object.keys(row));
    
    // Langsung berhenti biar terminal tidak penuh
    process.exit(0); 
  });