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

  // --- 1. FETCH DATA DARI FIREBASE ---
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const qProd = query(collection(db, "products"), limit(30)); 
        const prodSnapshot = await getDocs(qProd);
        
        const fetchedVideos = prodSnapshot.docs.map((doc) => {
            const data = doc.data();
            
            // Random Platform (Bisa disesuaikan jika data punya field khusus)
            const isTikTok = Math.random() < 0.5; 
            const randomViews = Math.floor(Math.random() * 5000000) + 10000;

            const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
            const keywords = cleanTitle.split(/\s+/).slice(0, 4).join(" ");

            return {
                id: doc.id,
                platform: isTikTok ? 'tiktok' : 'shopee',
                title: data.name || "Video Viral",
                image: data.image || "https://via.placeholder.com/300x400?text=No+Image",
                
                // --- INI KUNCINYA: SIMPAN LINK AFFILIATE ---
                affiliateLink: data.shopeeLink || data.tiktokLink || "", // Ambil link asli
                keyword: keywords, // Cadangan untuk search
                
                views: formatViews(randomViews)
            };
        });

        setVideos(shuffleArray(fetchedVideos));
        setLoading(false);

      } catch (error) {
        console.error("Gagal ambil video feed:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // --- 2. HANDLER KLIK (AFFILIATE PRIORITY) ---
  const handleVideoClick = (video: any) => {
    // A. JIKA ADA LINK AFFILIATE -> BUKA LANGSUNG! (CUAN MENGALIR)
    if (video.affiliateLink && video.affiliateLink !== "#") {
        window.open(video.affiliateLink, '_blank');
        return; // Stop di sini, jangan jalankan kode search di bawah
    }

    // B. JIKA TIDAK ADA LINK -> BARU LAKUKAN SEARCH (CADANGAN)
    const encodedKeyword = encodeURIComponent(video.keyword);
    
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    if (!isMobile) {
        // Desktop Search
        const searchUrl = video.platform === 'tiktok' 
            ? `https://www.tiktok.com/search?q=${encodedKeyword}`
            : `https://shopee.co.id/search?keyword=${encodedKeyword}`;
        window.open(searchUrl, '_blank');
        return;
    }

    // Mobile Search Intent (Pixel/iOS Fix)
    if (video.platform === 'tiktok') {
        const webLink = `https://www.tiktok.com/search?q=${encodedKeyword}`;
        if (isAndroid) {
            window.location.href = `intent://www.tiktok.com/search?q=${encodedKeyword}#Intent;scheme=https;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodeURIComponent(webLink)};end`;
        } else if (isIOS) {
            window.location.href = `tiktok://search/result?keyword=${encodedKeyword}`;
            setTimeout(() => { if (!document.hidden) window.location.href = webLink; }, 2500);
        }
    } else {
        // Shopee Search Intent
        const shopeeWeb = `https://shopee.co.id/search?keyword=${encodedKeyword}`;
        window.location.href = `intent://search?keyword=${encodedKeyword}#Intent;scheme=shopeeid;package=com.shopee.id;S.browser_fallback_url=${encodeURIComponent(shopeeWeb)};end`;
    }
  };

  if (loading) return (
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

      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x snap-mandatory px-1">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="relative flex-shrink-0 w-28 h-44 md:w-36 md:h-56 rounded-xl overflow-hidden cursor-pointer snap-center shadow-md transition-transform transform hover:scale-105 group bg-gray-100"
          >
            <img 
              src={video.image} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>

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

            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
            </div>

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