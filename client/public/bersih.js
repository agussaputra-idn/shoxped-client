import fs from 'fs';

console.log("1. Membaca data ke dalam memori...");
let products = JSON.parse(fs.readFileSync('./public/products.json', 'utf-8'));
console.log("2. Total awal: " + products.length);

console.log("3. Menyaring duplikat...");
let uniqueProducts = [];
let seen = new Set();

for (let i = 0; i < products.length; i++) {
let item = products[i];
if (item) {
let key = item.id ? item.id : (item.name + "-" + item.price);
if (!seen.has(key)) {
seen.add(key);
uniqueProducts.push(item);
}
}
}

// Kosongkan memori yang lama agar Mac tidak ngadat
products = null;

console.log("4. Total setelah bersih: " + uniqueProducts.length);
console.log("5. Menyimpan file diet ketat...");

fs.writeFileSync('./public/products.json', JSON.stringify(uniqueProducts));
console.log("6. BERHASIL SELESAI!");