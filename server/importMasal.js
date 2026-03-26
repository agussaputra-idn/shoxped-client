const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

console.log("=== 🚜 MESIN IMPORT MASAL SHOXPED v6.0 (MASTER EDITION) ===");
console.log("👉 Fitur: Anti-Duplikat + Laporan Detail + Support Semua Format");

const existingFile = './products.json';
let allProducts = [];
let productNames = new Set();

// 1. LOAD DATA LAMA
if (fs.existsSync(existingFile)) {
    const raw = fs.readFileSync(existingFile, 'utf8');
    allProducts = JSON.parse(raw);
    allProducts.forEach(p => {
        if (p.name) productNames.add(p.name.trim().toLowerCase());
    });
    console.log(`✅ Database Awal: ${allProducts.length.toLocaleString()} produk.`);
}

// 2. DETEKSI PEMISAH (LEBIH CERDAS)
function deteksiSeparator(content) {
    const firstLine = content.split('\n')[0];
    const koma = (firstLine.match(/,/g) || []).length;
    const titikKoma = (firstLine.match(/;/g) || []).length;
    const tab = (firstLine.match(/\t/g) || []).length;
    
    if (tab > koma && tab > titikKoma) return '\t';
    if (titikKoma > koma) return ';';
    return ',';
}

// 3. PENEBAK KOLOM (KAMUS LENGKAP + DB PRODUCTLIST)
function tebakKolom(headers) {
    const map = { name: null, price: null, image: null, link: null };

    headers.forEach(h => {
        // Hapus BOM (karakter aneh di awal file Excel) dan spasi
        const cleanH = h.replace(/^\uFEFF/, '').trim(); 
        const lower = cleanH.toLowerCase();
        
        // --- NAMA PRODUK ---
        if (!map.name && (lower === 'title' || lower === 'nama' || lower.includes('title') || lower.includes('name') || lower.includes('judul') || lower.includes('line-clamp'))) map.name = h;
        
        // --- HARGA ---
        if (!map.price && (lower === 'price' || lower === 'harga' || lower.includes('price') || lower.includes('harga') || lower.includes('font-medium'))) map.price = h;
        
        // --- GAMBAR ---
        if (!map.image && (lower === 'itemcard__image' || lower.includes('itemcard') || lower.includes('image') || lower.includes('img') || lower.includes('src'))) map.image = h;
        
        // --- LINK ---
        if (!map.link && (lower === 'affiliate link' || lower.includes('affiliate link') || lower.includes('link') || lower.includes('url') || lower.includes('href'))) map.link = h;
    });
    return map;
}

function cleanPrice(raw) {
    if (!raw) return 0;
    let clean = raw.toString().replace(/[^0-9,]/g, '').replace(/,/g, '');
    return parseInt(clean) || 0;
}

async function processFiles() {
    const files = fs.readdirSync('./').filter(f => f.endsWith('.csv') && !f.includes('shopee.csv') && !f.includes('shopee_kol.csv'));
    
    if (files.length === 0) return console.log("❌ Tidak ada file CSV baru.");

    console.log(`🔎 Ditemukan ${files.length} file CSV.`);
    
    for (const file of files) {
        // BACA FILE & BERSIHKAN BOM
        let content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
        const separatorDipakai = deteksiSeparator(content);
        
        console.log(`\n⬇️  Proses: ${file}`);
        
        let stats = { total: 0, masuk: 0, duplikat: 0, error: 0 };
        
        await new Promise((resolve) => {
            // Kita pakai stream dari content string yang sudah bersih
            const { Readable } = require('stream');
            const stream = Readable.from(content);

            stream
                .pipe(csv({ separator: separatorDipakai }))
                .on('headers', (headers) => {
                    global.cols = tebakKolom(headers);
                })
                .on('data', (row) => {
                    stats.total++;
                    const cols = global.cols;
                    
                    const name = row[cols.name];
                    const rawPrice = row[cols.price];
                    const image = row[cols.image]; 
                    const rawLink = row[cols.link];

                    if (name && rawPrice) {
                        const cleanName = name.trim();
                        const nameKey = cleanName.toLowerCase();

                        // CEK DUPLIKAT
                        if (productNames.has(nameKey)) {
                            stats.duplikat++;
                        } else {
                            // FORMAT DATA
                            let finalLink = rawLink || "#";
                            let finalImage = image || "https://via.placeholder.com/300";

                            // Fix Link & Gambar
                            if (finalLink.startsWith('/')) finalLink = `https://shopee.co.id${finalLink}`;
                            if (finalImage.includes('http')) {
                                const match = finalImage.match(/(https?:\/\/[^\s]+)/);
                                if (match) finalImage = match[0].replace(/["';]/g, '');
                            }

                            allProducts.push({
                                id: `IMP-${Date.now()}-${Math.floor(Math.random()*100000)}`,
                                name: cleanName,
                                price: cleanPrice(rawPrice),
                                image: finalImage,
                                link: finalLink,
                                category: path.parse(file).name.replace('.csv', ''),
                                brand: "Generic" 
                            });
                            productNames.add(nameKey);
                            stats.masuk++;
                        }
                    } else {
                        stats.error++; // Gagal baca baris ini (biasanya baris kosong)
                    }
                })
                .on('end', () => {
                    // LAPORAN LENGKAP
                    console.log(`   📄 Total Baris : ${stats.total.toLocaleString()}`);
                    console.log(`   ✅ BERHASIL    : ${stats.masuk.toLocaleString()} (Produk Baru)`);
                    console.log(`   🗑️  DUPLIKAT    : ${stats.duplikat.toLocaleString()} (Sudah Ada - Dibuang)`);
                    if (stats.error > 0) console.log(`   ⚠️  ERROR       : ${stats.error} (Baris Kosong/Rusak)`);
                    resolve();
                });
        });
    }

    console.log("\n💾 Menyimpan database...");
    fs.writeFileSync(existingFile, JSON.stringify(allProducts, null, 2));
    console.log("========================================");
    console.log(`🎉 TOTAL GUDANG SEKARANG: ${allProducts.length.toLocaleString()} PRODUK`);
    console.log("👉 JANGAN LUPA RESTART SERVER: (Ctrl+C -> node index.js)");
}

processFiles();