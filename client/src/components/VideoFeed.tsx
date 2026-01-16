import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';

// --- DATA CADANGAN (JAGA-JAGA BIAR GAK KOSONG) ---
const BACKUP_DATA = [
  { id: 'b1', title: 'Racun Shopee Murah', image: 'https://img.freepik.com/free-photo/portrait-young-woman-with-shopping-bags_23-2148466699.jpg', views: '1.2M', keyword: 'baju murah wanita' },
  { id: 'b2', title: 'Gadget Viral 2024', image: 'https://img.freepik.com/free-photo/technology-concept-with-cyber-aesthetics_23-2151128532.jpg', views: '850K', keyword: 'hp murah spek dewa' },
  { id: 'b3', title: 'Skincare Glowing', image: 'https://img.freepik.com/free-photo/beauty-product-still-life_23-2147817669.jpg', views: '2.5M', keyword: 'paket skincare glowing' },
  { id: 'b4', title: 'OOTD Kekinian', image: 'https://img.freepik.com/free-photo/full-shot-woman-posing-studio_23-2150896677.jpg', views: '500K', keyword: 'ootd hijab style' },
  { id: 'b5', title: 'Sepatu Sekolah Kuat', image: 'https://img.freepik.com/free-photo/pair-trainers_144627-3800.jpg', views: '3.1M', keyword: 'sepatu sekolah hitam' },
];

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

  // --- AMBIL DATA (FIREBASE + BACKUP) ---
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Ambil 15 produk dari Firebase
        const qProd = query(collection(db, "products"), limit(15)); 
        const prodSnapshot = await getDocs(qProd);
        
        let fetchedVideos = prodSnapshot.docs.map((doc) => {
            const data = doc.data();
            const isTikTok = Math.random() < 0.6; // 60% TikTok
            const randomViews = Math.floor(Math.random() * 5000000) + 10000;
            const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
            const keywords = cleanTitle.split(/\s+/).slice(0, 4).join(" ");

            return {
                id: doc.id,
                platform: isTikTok ? 'tiktok' : 'shopee',
                title: data.name || "Video Viral",
                image: data.image || "https://via.placeholder.com/300x400",
                keyword: keywords,
                views: formatViews(randomViews)
            };
        });

        // JIKA FIREBASE KOSONG, PAKAI DATA CADANGAN
        if (fetchedVideos.length === 0) {
            fetchedVideos = BACKUP_DATA.map(item => ({
                ...item,
                platform: Math.random() < 0.5 ? 'tiktok' : 'shopee'
            }));
        }

        // Acak biar fresh
        setVideos(shuffleArray(fetchedVideos));
      } catch (error) {
        console.log("Gagal ambil data, pakai backup", error);
        // Fallback error
        const backup = BACKUP_DATA.map(item => ({ ...item, platform: 'tiktok' }));
        setVideos(backup);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // --- HANDLER KLIK (LOGIKA v5.0 YANG SUDAH SUKSES) ---
  const handleVideoClick = (video: any) => {
    const encodedKeyword = encodeURIComponent(video.keyword);
    
    // Deteksi Mobile
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isDesktop = !isAndroid && !isIOS;

    if (isDesktop) return; // Desktop diam saja atau buka tab baru (opsional)

    if (video.platform === 'tiktok') {
        // TIKTOK LOGIC
        const webLink = `https://www.tiktok.com/search?q=${encodedKeyword}`;
        const encodedWeb = encodeURIComponent(webLink);

        if (isAndroid) {
            // Android: Intent HTTPS Force (Pixel Fix)
            window.location.href = `intent://www.tiktok.com/search?q=${encodedKeyword}#Intent;scheme=https;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodedWeb};end`;
        } else if (isIOS) {
            // iOS: Deep Link + Timer
            window.location.href = `tiktok://search/result?keyword=${encodedKeyword}`;
            setTimeout(() => { if (!document.hidden) window.location.href = webLink; }, 2500);
        }
    } else {
        // SHOPEE LOGIC
        const shopeeWeb = `https://shopee.co.id/search?keyword=${encodedKeyword}`;
        const shopeeApp = `intent://search?keyword=${encodedKeyword}#Intent;scheme=shopeeid;package=com.shopee.id;S.browser_fallback_url=${encodeURIComponent(shopeeWeb)};end`;
        window.location.href = shopeeApp;
    }
  };

  if (loading) return (
     <div className="flex gap-3 px-2 pb-4 overflow-hidden mb-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="w-24 h-40 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
        ))}
     </div>
  );

  return (
    <div className="w-full mb-6 mt-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Video Trending
        </h3>
        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Live Update</span>
      </div>

      {/* --- AREA SCROLL HORIZONTAL (STORY STYLE) --- */}
      <div className="flex overflow-x-auto gap-3 pb-4 px-1 no-scrollbar snap-x snap-mandatory">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="relative flex-shrink-0 w-28 h-48 md:w-32 md:h-56 rounded-xl overflow-hidden cursor-pointer snap-center shadow-md border border-gray-200"
          >
            {/* 1. Gambar Full */}
            <img 
              src={video.image} 
              alt={video.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* 2. Gradient Gelap di Bawah (Supaya tulisan kebaca) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>

            {/* 3. Badge Platform (Pojok Kiri Atas) */}
            <div className="absolute top-2 left-2">
                {video.platform === 'tiktok' ? (
                    <div className="bg-black/60 backdrop-blur-sm p-1 rounded-full border border-white/20">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.1-.09 1.57-.1 3.15-.02 4.73.01 2.44-.33 4.92-1.29 7.21-.95 2.27-2.61 4.19-4.82 5.37-2.21 1.18-4.8 1.48-7.23.83-2.43-.65-4.59-2.33-5.83-4.54-1.24-2.21-1.37-4.9-.36-7.18 1.01-2.28 2.95-4.07 5.33-4.93.66-.24 1.35-.4 2.05-.48v4.22c-1.63.15-3.12 1.17-3.8 2.66-.69 1.49-.36 3.32.84 4.54 1.2 1.22 3.12 1.53 4.63.75 1.51-.78 2.45-2.43 2.45-4.13V.02z"/></svg>
                    </div>
                ) : (
                    <div className="bg-orange-500/90 backdrop-blur-sm p-1 rounded-full border border-white/20">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M19.8 7.6c-.2-.6-.9-1-1.6-1.1-.6-.1-1.3.1-1.8.5L13 9.8c-.2.2-.5.3-.8.3-.3 0-.6-.1-.8-.3l-3.4-2.8c-.5-.4-1.2-.6-1.8-.5-.7.1-1.4.5-1.6 1.1-.3.7-.1 1.6.5 2.1l3.7 3.1c.9.7 2 1.1 3.2 1.1s2.3-.4 3.2-1.1l3.7-3.1c.6-.5.8-1.4.5-2.1zM21 13c0-4.4-3.6-8-8-8s-8 3.6-8 8v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6z"/></svg>
                    </div>
                )}
            </div>

            {/* 4. Tombol Play Tengah */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                </div>
            </div>

            {/* 5. Teks Judul & Views */}
            <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight mb-1 drop-shadow-md">
                    {video.title}
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-200">👁 {video.views}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;