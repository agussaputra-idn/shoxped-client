import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';

// --- HELPER FUNCTIONS ---
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Format Angka Jutaan (biar pendek kayak 1.2M)
const formatViews = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const VideoFeed = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA DARI FIREBASE ---
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Kita ambil data produk biasa, tapi kita "sulap" jadi tampilan video
        // Ambil 30 produk acak
        const qProd = query(collection(db, "products"), limit(30)); 
        const prodSnapshot = await getDocs(qProd);
        
        const fetchedVideos = prodSnapshot.docs.map((doc) => {
            const data = doc.data();
            
            // Simulasi data "Video" dari data produk
            const isTikTok = Math.random() < 0.5; // 50% TikTok, 50% Shopee
            const randomViews = Math.floor(Math.random() * 5000000) + 10000; // Views palsu biar keren

            // Bersihkan judul untuk keyword pencarian
            const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
            const keywords = cleanTitle.split(/\s+/).slice(0, 4).join(" "); // Ambil 4 kata pertama

            return {
                id: doc.id,
                platform: isTikTok ? 'tiktok' : 'shopee',
                title: data.name || "Video Viral",
                image: data.image || "https://via.placeholder.com/300x400?text=No+Image",
                keyword: keywords, // Ini yang dipakai buat Deep Link Search
                views: formatViews(randomViews)
            };
        });

        // Acak urutan agar fresh
        setVideos(shuffleArray(fetchedVideos));
        setLoading(false);

      } catch (error) {
        console.error("Gagal ambil video feed:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // --- 2. HANDLER KLIK (JURUS INTENT FINAL v5.0) ---
  const handleVideoClick = (video: any) => {
    const encodedKeyword = encodeURIComponent(video.keyword);
    
    // Deteksi Mobile
    const isMobile = /android|iPad|iPhone|iPod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isMobile) {
        if (video.platform === 'tiktok') {
            // TIKTOK LOGIC (Pixel Fix + iOS)
            const webLink = `https://www.tiktok.com/search?q=${encodedKeyword}`;
            const encodedWeb = encodeURIComponent(webLink);

            if (isAndroid) {
                // Android Intent HTTPS (Force Package)
                window.location.href = `intent://www.tiktok.com/search?q=${encodedKeyword}#Intent;scheme=https;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodedWeb};end`;
            } else if (isIOS) {
                // iOS Deep Link
                window.location.href = `tiktok://search/result?keyword=${encodedKeyword}`;
                setTimeout(() => { if (!document.hidden) window.location.href = webLink; }, 2500);
            }

        } else {
            // SHOPEE LOGIC
            // Shopee App Intent
            const shopeeWeb = `https://shopee.co.id/search?keyword=${encodedKeyword}`;
            const shopeeApp = `intent://search?keyword=${encodedKeyword}#Intent;scheme=shopeeid;package=com.shopee.id;S.browser_fallback_url=${encodeURIComponent(shopeeWeb)};end`;
            window.location.href = shopeeApp;
        }
    } else {
        // Desktop Fallback (Buka Tab Baru)
        if (video.platform === 'tiktok') {
            window.open(`https://www.tiktok.com/search?q=${encodedKeyword}`, '_blank');
        } else {
            window.open(`https://shopee.co.id/search?keyword=${encodedKeyword}`, '_blank');
        }
    }
  };

  if (loading) return (
     // Skeleton Loading Horizontal
     <div className="flex gap-3 px-2 pb-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="w-28 h-44 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
        ))}
     </div>
  );

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <span className="animate-pulse text-red-500">●</span> Live Trending
        </h3>
        <span className="text-[10px] text-gray-400">Update Tiap Saat</span>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x snap-mandatory px-1">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="relative flex-shrink-0 w-28 h-44 md:w-36 md:h-56 rounded-xl overflow-hidden cursor-pointer snap-center shadow-md transition-transform transform hover:scale-105 group bg-gray-100"
          >
            {/* Image Thumbnail */}
            <img 
              src={video.image} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            
            {/* Overlay Gradient (Bawah Gelap agar tulisan terbaca) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>

            {/* Platform Badge (Atas Kanan) */}
            <div className="absolute top-2 right-2">
                {video.platform === 'tiktok' ? (
                    <span className="bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1">
                        <span className="text-[8px]">🎵</span> TikTok
                    </span>
                ) : (
                    <span className="bg-orange-500/80 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1">
                        <span className="text-[8px]">🛍</span> Shopee
                    </span>
                )}
            </div>

            {/* Play Icon Center (Animasi Scale) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
            </div>

            {/* Text Content (Bawah) */}
            <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] md:text-xs font-bold line-clamp-2 leading-tight mb-1 drop-shadow-sm">
                    {video.title}
                </p>
                <div className="flex items-center gap-1 opacity-90">
                    <span className="text-[8px] text-white">👁 {video.views}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;