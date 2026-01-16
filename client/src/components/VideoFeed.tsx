import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const formatViews = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const VideoFeed = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const qProd = query(collection(db, "products"), limit(20)); 
        const prodSnapshot = await getDocs(qProd);
        
        const fetchedVideos = prodSnapshot.docs.map((doc) => {
            const data = doc.data();
            const isTikTok = Math.random() < 0.5; 
            const randomViews = Math.floor(Math.random() * 5000000) + 10000;
            const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
            const keywords = cleanTitle.split(/\s+/).slice(0, 4).join(" ");

            return {
                id: doc.id,
                platform: isTikTok ? 'tiktok' : 'shopee',
                title: data.name || "Inspirasi Belanja",
                image: data.image || "https://via.placeholder.com/300x400?text=No+Image",
                
                // --- PERBAIKAN: SIMPAN KEDUA LINK SECARA TERPISAH ---
                shopeeLink: data.shopeeLink || "#",
                tiktokLink: data.tiktokLink || "#", // Pastikan field ini ada di DB jika mau direct link
                
                keyword: keywords,
                views: formatViews(randomViews)
            };
        });

        setVideos(shuffleArray(fetchedVideos));
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil feed:", error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoClick = (video: any) => {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;
    const encodedKeyword = encodeURIComponent(video.keyword);

    // --- LOGIKA PEMISAH (Platform Strict) ---

    if (video.platform === 'tiktok') {
        // === JIKA BADGE TIKTOK ===
        
        // 1. Cek Link Affiliate TikTok Dulu (Jika ada)
        if (video.tiktokLink && video.tiktokLink !== "#") {
            window.open(video.tiktokLink, '_blank');
            return;
        }

        // 2. Fallback: Search di TIKTOK (Bukan Shopee)
        if (!isMobile) {
            window.open(`https://www.tiktok.com/search?q=${encodedKeyword}`, '_blank');
        } else {
            const webLink = `https://www.tiktok.com/search?q=${encodedKeyword}`;
            if (isAndroid) {
                // Pixel Fix Intent
                window.location.href = `intent://www.tiktok.com/search?q=${encodedKeyword}#Intent;scheme=https;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodeURIComponent(webLink)};end`;
            } else {
                // iOS Deep Link
                window.location.href = `tiktok://search/result?keyword=${encodedKeyword}`;
                setTimeout(() => { if (!document.hidden) window.location.href = webLink; }, 2500);
            }
        }

    } else {
        // === JIKA BADGE SHOPEE ===

        // 1. Cek Link Affiliate Shopee Dulu
        if (video.shopeeLink && video.shopeeLink !== "#") {
            window.open(video.shopeeLink, '_blank');
            return;
        }

        // 2. Fallback: Search di SHOPEE
        if (!isMobile) {
            window.open(`https://shopee.co.id/search?keyword=${encodedKeyword}`, '_blank');
        } else {
            const shopeeWeb = `https://shopee.co.id/search?keyword=${encodedKeyword}`;
            window.location.href = `intent://search?keyword=${encodedKeyword}#Intent;scheme=shopeeid;package=com.shopee.id;S.browser_fallback_url=${encodeURIComponent(shopeeWeb)};end`;
        }
    }
  };

  if (loading) return (
     <div className="flex gap-3 px-2 pb-4 overflow-hidden">
        {[...Array(4)].map((_, i) => <div key={i} className="w-28 h-48 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />)}
     </div>
  );

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <span className="text-lg">✨</span> Inspirasi Belanja
        </h3>
        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Pilihan Terbaik
        </span>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-4 px-1 no-scrollbar snap-x snap-mandatory">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="relative flex-shrink-0 w-28 h-48 md:w-32 md:h-56 rounded-xl overflow-hidden cursor-pointer snap-center shadow-md border border-gray-200 group"
          >
            <img 
              src={video.image} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10"></div>

            <div className="absolute top-2 right-2 z-10">
                {video.platform === 'tiktok' ? (
                    <div className="flex items-center gap-1 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-md border border-gray-600 shadow-sm">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.1-.09 1.57-.1 3.15-.02 4.73.01 2.44-.33 4.92-1.29 7.21-.95 2.27-2.61 4.19-4.82 5.37-2.21 1.18-4.8 1.48-7.23.83-2.43-.65-4.59-2.33-5.83-4.54-1.24-2.21-1.37-4.9-.36-7.18 1.01-2.28 2.95-4.07 5.33-4.93.66-.24 1.35-.4 2.05-.48v4.22c-1.63.15-3.12 1.17-3.8 2.66-.69 1.49-.36 3.32.84 4.54 1.2 1.22 3.12 1.53 4.63.75 1.51-.78 2.45-2.43 2.45-4.13V.02z"/></svg>
                        TikTok
                    </div>
                ) : (
                    <div className="flex items-center gap-1 bg-[#ee4d2d] text-white text-[9px] font-bold px-2 py-1 rounded-md border border-orange-400 shadow-sm">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M19.8 7.6c-.2-.6-.9-1-1.6-1.1-.6-.1-1.3.1-1.8.5L13 9.8c-.2.2-.5.3-.8.3-.3 0-.6-.1-.8-.3l-3.4-2.8c-.5-.4-1.2-.6-1.8-.5-.7.1-1.4.5-1.6 1.1-.3.7-.1 1.6.5 2.1l3.7 3.1c.9.7 2 1.1 3.2 1.1s2.3-.4 3.2-1.1l3.7-3.1c.6-.5.8-1.4.5-2.1zM21 13c0-4.4-3.6-8-8-8s-8 3.6-8 8v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6z"/></svg>
                        Shopee
                    </div>
                )}
            </div>

            <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight mb-1 drop-shadow-md">
                    {video.title}
                </p>
                <p className="text-gray-300 text-[9px] flex items-center gap-1">
                   👁 {video.views} • Cek Sini &gt;
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;