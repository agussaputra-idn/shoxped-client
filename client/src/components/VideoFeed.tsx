import React, { useRef } from 'react';

interface VideoFeedProps {
  featuredProducts?: any[]; 
}

const VideoFeed = ({ featuredProducts = [] }: VideoFeedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="flex gap-3 px-2 pb-4 overflow-hidden">
        {[...Array(4)].map((_, i) => <div key={i} className="w-[110px] h-[190px] bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />)}
     </div>
    );
  }

  // === LOGIKA KLIK LINK DIPERBAIKI (FINAL) ===
  const handleVideoClick = (video: any, isTikTok: boolean) => {
    const isAndroid = /android/i.test(navigator.userAgent);
    const encodedKeyword = encodeURIComponent(video.title);

    if (isTikTok) {
        // JIKA LOGONYA TIKTOK -> BUKA TIKTOK
        const webLink = video.finalTikTokLink || `https://www.tiktok.com/search?q=${encodedKeyword}`;
        if (isAndroid && video.androidLink) {
             window.location.href = video.androidLink;
        } else {
             window.open(webLink, '_blank');
        }
    } else {
        // JIKA LOGONYA SHOPEE -> BUKA SHOPEE
        const webLink = video.shopeeLink || `https://shopee.co.id/search?keyword=${encodedKeyword}`;
        if (video.shopeeLink && video.shopeeLink !== "#") {
             window.open(video.shopeeLink, '_blank');
        } else {
             window.open(webLink, '_blank');
        }
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          {/* JUDUL BARU */}
          <span className="text-lg text-red-500">✨</span> Inspirasi Belanja
        </h3>
        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
            Flash Sale 🔥
        </span>
      </div>

      <div className="flex overflow-x-auto gap-2.5 pb-4 px-1 no-scrollbar snap-x snap-mandatory">
        {featuredProducts.map((video, index) => {
          // Tentukan Platform (Genap = TikTok, Ganjil = Shopee)
          const isTikTok = index % 2 === 0; 
          const sales = video.sales || "10RB+";

          return (
            <div 
                key={`${video.id}-${index}`}
                // OPER isTikTok AGAR LINK SESUAI ICON
                onClick={() => handleVideoClick(video, isTikTok)}
                className="relative flex-shrink-0 w-[110px] h-[190px] md:w-[130px] md:h-[220px] bg-black rounded-xl overflow-hidden cursor-pointer snap-start shadow-md group border border-gray-100"
            >
                {/* GAMBAR FULL COVER */}
                <img 
                    src={video.image} 
                    alt={video.title} 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                    loading="lazy"
                />
                
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>

                {/* LOGO TEXT ONLY */}
                <div className="absolute top-2 left-2 z-10">
                    {isTikTok ? (
                        <div className="text-[10px] font-bold text-white drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                            TikTok
                        </div>
                    ) : (
                        <div className="text-[10px] font-bold text-[#ee4d2d] bg-white/90 px-1.5 py-0.5 rounded-sm drop-shadow-md">
                            Shopee
                        </div>
                    )}
                </div>

                {/* TOMBOL PLAY SUDAH DIHAPUS DISINI */}

                {/* INFO BAWAH (HANYA ANGKA, TANPA 'VIEWS') */}
                <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight mb-1 drop-shadow-md">
                        {video.title}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-gray-300">
                       <span>🔥 {sales}</span>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoFeed;