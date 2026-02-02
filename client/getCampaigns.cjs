require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

console.log("=== ACCESSTRADE CAMPAIGN FINDER (V2) ===");

// 1. Setup Kunci
const userUid = process.env.ACCESSTRADE_USER_UID;
const secretKey = process.env.ACCESSTRADE_SECRET_KEY;

// Buat Token
const payload = {
    sub: userUid,
    iat: Math.floor(Date.now() / 1000)
};
const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

async function getCampaigns() {
    console.log("🚀 Sedang scan seluruh Campaign di akun Anda...");

    try {
        // PERBAIKAN: Kita tembak ke level 'publishers/me', bukan 'sites'
        // Ini akan menampilkan semua campaign yang sudah Bapak apply
        const url = `https://gurkha.accesstrade.global/v1/publishers/me/campaigns?countryCode=ID&status=affiliated`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Accesstrade-User-Type': 'publisher',
                'X-Accesstrade-Country-Code': 'ID'
            }
        });

        const campaigns = response.data.campaigns;
        
        if (campaigns.length > 0) {
            console.log(`\n✅ DITEMUKAN ${campaigns.length} CAMPAIGN AKTIF!`);
            console.log("=============================================");
            
            campaigns.forEach(camp => {
                console.log(`Merchant : ${camp.title}`);
                console.log(`ID SAKTI : ${camp.id}`); // <--- INI NOMOR YANG KITA CARI
                console.log("---------------------------------------------");
            });
            console.log("👉 Silakan copy 'ID SAKTI' dari Shopee & TikTok, lalu kirim ke sini.");
        } else {
            console.log("\n❌ Tidak ditemukan campaign aktif. Aneh juga ya.");
        }

    } catch (error) {
        console.log("\n❌ API ERROR:");
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(error.message);
        }
    }
}

getCampaigns();