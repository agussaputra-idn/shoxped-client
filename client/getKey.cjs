const axios = require('axios');
const CryptoJS = require('crypto-js');
const readline = require('readline-sync');

console.log("=== ACCESSTRADE KEY FETCHER (VERSI KAPITAL) ===");
console.log("Mencoba dengan Country Code Uppercase 'ID'...\n");

// 1. INPUT KREDENSIAL
const email = readline.question('Masukkan Email AccessTrade Anda: ');
const password = readline.question('Masukkan Password AccessTrade Anda: ', { hideEchoBack: true });

// 2. RUMUS HACKER
const md5Password = CryptoJS.MD5(password).toString();
const rawSignature = `${email}:${md5Password}`;
const authHeader = CryptoJS.SHA256(rawSignature).toString();

console.log("\nSedang menghubungi server AccessTrade (Gurkha)...");

// 3. TEMBAK API (PERUBAHAN: 'id' menjadi 'ID')
// Server biasanya minta ISO 3166-1 Alpha-2 Uppercase
const targetUrl = `https://gurkha.accesstrade.global/publishers/auth/${email}?countryCode=ID`;

axios.get(targetUrl, {
    headers: {
        'Authorization': authHeader,
        'X-Accesstrade-User-Type': 'publisher',
        'X-Accesstrade-Country-Code': 'ID' // Huruf Besar juga di sini
    }
})
.then(response => {
    console.log("\n✅ JEBOL PAK BOS! ALHAMDULILLAH!");
    console.log("========================================");
    console.log("User UID   :", response.data.userUid);
    console.log("Secret Key :", response.data.secretKey);
    console.log("Account ID :", response.data.accountId);
    console.log("========================================");
    console.log("⚠️  SIMPAN KODE INI SEKARANG JUGA!");
})
.catch(error => {
    console.log("\n❌ MASIH BANDEL?");
    if (error.response) {
        console.log(`Status Server: ${error.response.status}`);
        console.log("Pesan Error:", JSON.stringify(error.response.data, null, 2));
    } else {
        console.log("Error Teknis:", error.message);
    }
});