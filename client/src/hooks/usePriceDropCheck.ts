import { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const usePriceDropCheck = () => {
  const { wishlist } = useWishlist();
  const [discountedProduct, setDiscountedProduct] = useState<any | null>(null);

  // 1. LOG AWAL (Biar tau kodenya jalan)
  console.log("📢 CCTV AKTIF! Menunggu data...", wishlist);

  useEffect(() => {
    const checkPrices = async () => {
      console.log("🕵️‍♂️ Detektif: Mulai Investigasi...");

      if (wishlist.length === 0) {
        console.log("🚫 Wishlist Kosong. User belum nge-love apa-apa.");
        return;
      }

      for (const item of wishlist) {
        // Log ID biar kita tau ID mana yang dicek
        console.log(`🔎 Mengecek Produk ID: ${item.id} | Nama: ${item.title || item.name}`);

        try {
            const docRef = doc(db, "products", item.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const liveData = docSnap.data();
                const livePrice = parseInt(liveData.price);
                const savedPrice = parseInt(item.shopeePrice || item.price || 0);

                console.log(`   📊 Bandingkan: Wishlist(${savedPrice}) vs Database(${livePrice})`);

                if (livePrice < savedPrice && (savedPrice - livePrice) > 1000) {
                    console.log("🎉 DISKON DITEMUKAN! Memunculkan Popup...");
                    setDiscountedProduct({
                        ...item,
                        newPrice: livePrice,
                        oldPrice: savedPrice
                    });
                    break; 
                } else {
                    console.log("   ❌ Belum diskon/Harga sama.");
                }
            } else {
                console.log("   👻 Produk Hantu (Tidak ada di Database). ID salah?");
            }
        } catch (err) {
            console.error("🔥 Error saat ambil data:", err);
        }
      }
    };

    const timeout = setTimeout(() => {
        checkPrices();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [wishlist]);

  return { discountedProduct, clearNotification: () => setDiscountedProduct(null) };
};