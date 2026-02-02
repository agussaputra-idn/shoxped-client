require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

console.log("=== ACCESSTRADE ULTIMATE DOWNLOADER ===");

// 1. SETUP KUNCI
const userUid = process.env.ACCESSTRADE_USER_UID;
const secretKey = process.env.ACCESSTRADE_SECRET_KEY;
const mySiteId = 122529;

// ==================================================
// 🎛️ PILIH ID CAMPAIGN BARU (DARI SCREENSHOT BAPAK)
// ==================================================

const CAMPAIGN_ID = "6081";   // <--- SHOPEE KOL TIER 1 (Harapan Baru!)

// ==================================================

if (!userUid || !secretKey) {
    console.error("❌ ERROR: File .env belum diisi!");
    process.exit(1);
}

const payload = { sub: userUid, iat: Math.floor(Date.now() / 1000) };
const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

async function getProductFeed() {
    console.log(`\n🚀 Sedang menyedot data SHOPEE KOL (ID: ${CAMPAIGN_ID})...`);

    try {
        const url = `https://gurkha.accesstrade.global/v1/publishers/me/sites/${mySiteId}/campaigns/${CAMPAIGN_ID}/productfeed/url?countryCode=ID`;

        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}`, 'X-Accesstrade-User-Type': 'publisher', 'X-Accesstrade-Country-Code': 'ID' }
        });

        console.log("\n🎉 LINK DOWNLOAD SIAP!");
        console.log("=======================================================");
        console.log(response.data.baseUrl);
        console.log("=======================================================");
        console.log("👉 Copy Link -> Download di Browser");
        console.log("👉 RENAME file hasil download jadi: shopee_kol.csv");
        console.log("👉 Pindahkan ke folder SERVER");

    } catch (error) {
        console.log("\n❌ GAGAL:");
        if (error.response && error.response.status === 404) {
            console.log("⚠️ Campaign ini ternyata TIDAK menyediakan file CSV (No Datafeed).");
        } else {
            console.log(error.message);
        }
    }
}

getProductFeed();