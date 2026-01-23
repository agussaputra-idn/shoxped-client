import { useEffect } from 'react';

export const useAffiliateConverter = () => {
  useEffect(() => {
    // KUNCI RAHASIA SHOPEE (ACCESSTRADE)
    const SHOPEE_PREFIX = "https://atid.me/002bc7002mjl?url=";
    
    // Logic Pengubah Link
    const convertLinks = () => {
      const allLinks = document.querySelectorAll('a');

      allLinks.forEach((anchor) => {
        const originalLink = anchor.getAttribute('href');

        // Pastikan link valid, menuju Shopee, dan belum dimonetisasi
        if (originalLink && 
            originalLink.includes("shopee.co.id") && 
            !originalLink.includes("atid.me")) {
          
          try {
            // Encode Link Asli
            const encodedUrl = encodeURIComponent(originalLink);
            
            // Ubah jadi Link Cuan
            anchor.setAttribute('href', SHOPEE_PREFIX + encodedUrl);
            
            // Buka tab baru (Wajib untuk affiliate)
            anchor.setAttribute('target', '_blank'); 
            anchor.setAttribute('rel', 'noopener noreferrer');
          } catch (e) {
            console.error("Gagal convert link:", e);
          }
        }
        // Logic TikTok (Safe Mode) - Biarkan link asli tapi buka tab baru
        else if (originalLink && (originalLink.includes("tiktok.com") || originalLink.includes("shop.tiktok"))) {
           if (anchor.getAttribute('target') !== '_blank') {
               anchor.setAttribute('target', '_blank');
               anchor.setAttribute('rel', 'noopener noreferrer');
           }
        }
      });
    };

    // Jalankan saat load
    convertLinks();

    // Pantau perubahan layar (untuk scroll/pindah halaman)
    const observer = new MutationObserver(convertLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
};