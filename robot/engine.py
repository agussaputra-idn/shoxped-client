import firebase_admin
from firebase_admin import credentials, firestore
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
import os
import random

# --- 1. SETUP FIREBASE ---
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# --- 2. FUNGSI PEMBERSIH ANGKA ---
def clean_price(price_text):
    nums = re.findall(r'\d+', price_text.replace('.', '').replace(',', ''))
    if nums:
        return int(nums[0])
    return 0

# --- 3. OTAK UTAMA ---
def run_scraper():
    print("👻 STEALTH MODE AKTIF! Menyiapkan Browser Hantu...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "chrome_data_stealth")
    
    options = uc.ChromeOptions()
    options.add_argument(f"--user-data-dir={data_dir}")
    options.add_argument("--no-first-run")
    options.add_argument("--password-store=basic")
    
    # UPDATE: Saya ganti ke 131 biar aman, atau hapus parameternya kalau error
    driver = uc.Chrome(options=options, use_subprocess=True, version_main=144) 
    
    try:
        # Pancingan Awal
        driver.get("https://shopee.co.id") 
        time.sleep(3)

        products_ref = db.collection("products")
        docs = products_ref.stream()

        for doc in docs:
            # --- [PERBAIKAN DI SINI] ---
            # Kita WAJIB ambil data dulu sebelum dipanggil
            data = doc.to_dict()
            product_name = data.get('name', 'Unknown')
            shopee_url = data.get('shopeeUrl') # Pastikan field di Firebase 'shopeeUrl' (huruf besar U)
            current_db_price = data.get('price', 0)

            # Cek link ada atau tidak
            if not shopee_url:
                continue

            print(f"\n🔎 Mengintai: {product_name}")
            
            # --- LOGIC STRESS TEST (JEDA MANUSIA) ---
            delay = random.uniform(5, 10) 
            print(f"   ⏳ Menunggu {delay:.1f} detik sebelum buka link...")
            time.sleep(delay)
            
            # Buka Link
            driver.get(shopee_url)
            time.sleep(random.uniform(3, 5)) # Tambahan waktu loading page
            
            # CEK LOGIN
            if "login" in driver.current_url:
                print("🛑 TERDETEKSI LOGIN SCREEN!")
                print("👉 Silakan Login Manual. Saya tunggu 2 menit...")
                time.sleep(120)
            
            real_price = 0
            
            # --- JURUS 1: CARI ELEMEN SPESIFIK ---
            try:
                price_element = WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, "//*[contains(., 'Rp') and string-length(.) < 40 and string-length(.) > 3]"))
                )
                driver.execute_script("arguments[0].scrollIntoView();", price_element)
                real_price = clean_price(price_element.text)
                print(f"   🎯 Metode 1 (Element) dapet: Rp{real_price}")
            except:
                print("   ⚠️ Metode 1 gagal. Mengaktifkan Jurus Sapu Jagat (Regex)...")

            # --- JURUS 2: SAPU JAGAT (REGEX) ---
            if real_price == 0:
                try:
                    body_text = driver.find_element(By.TAG_NAME, "body").text
                    matches = re.findall(r'Rp\s?[0-9.]+', body_text)
                    
                    if matches:
                        print(f"   📋 Ditemukan {len(matches)} harga kandidat.")
                        for m in matches:
                            candidate = clean_price(m)
                            if candidate > 1000: 
                                real_price = candidate
                                print(f"   🎯 Metode 2 (Regex) memilih: Rp{real_price}")
                                break
                except Exception as e:
                    print(f"   ❌ Metode 2 error: {e}")

            # --- FINAL UPDATE ---
            if real_price > 1000:
                print(f"   💰 HARGA FINAL: Rp{real_price}")
                
                if real_price != current_db_price:
                    print("   ⚡ HARGA BERUBAH! Update Database...")
                    db.collection("products").document(doc.id).update({
                        "price": real_price,
                        "updatedAt": firestore.SERVER_TIMESTAMP
                    })
                    print("   ✅ Database Updated!")
                else:
                    print("   💤 Harga Stabil.")
            else:
                print("   ❌ Gagal Total. Harga tidak ditemukan.")

    except Exception as fatal:
        print(f"🔥 Error Fatal: {fatal}")
        
    finally:
        print("🏁 Selesai.")
        # driver.quit() 

if __name__ == "__main__":
    run_scraper()