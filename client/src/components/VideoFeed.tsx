import React from 'react';

// SAYA PASANG CCTV DISINI (Versi Fix Link atid.me)
console.log("✅ Component VideoFeed loaded. Link format: atid.me");

const VideoFeed = ({ featuredProducts }: { featuredProducts: any[] }) => {
  
  if (!featuredProducts || featuredProducts.length === 0) return null;

  // --- 1. SETTING ACCESSTRADE ---
  const ACCESSTRADE_ID = "002bc7002mjl"; // ID Bapak

  // --- 2. LOGIC MEMPROSES DATA ---
  const processedData = featuredProducts.map((item, index) => {
    const platformType = item.platform || (index % 2 === 0 ? 'shopee' : 'tiktok');
    
    // Ambil URL apa adanya
    const rawUrl = item.url || item.productUrl || item.link || item.originalUrl || '#';

    return {
      ...item,
      platform: platformType,
      displayName: item.title || item.name || 'Produk Viral',
      displayImage: item.image || item.imageUrl || 'https://via.placeholder.com/150',
      displayPrice: item.price || 'Cek Harga',
      originalUrl: rawUrl
    };
  });

  // --- 3. FUNCTION GENERATE LINK (FIXED) ---
  const getLink = (item: any) => {
    
    // A. JIKA TIKTOK -> Ke Pencarian TikTok
    if (item.platform === 'tiktok') {
      return `https://www.tiktok.com/search?q=${encodeURIComponent(item.displayName)}`;
    } 
    
    // B. JIKA SHOPEE -> Convert ke AccessTrade (Format atid.me)
    else {
      let targetUrl = item.originalUrl;

      // SAFETY: Jika link asli kosong/localhost, arahkan ke pencarian Shopee
      if (!targetUrl || targetUrl === '#' || targetUrl.includes('localhost')) {
         targetUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(item.displayName)}`;
      }

      // Generate Deep Link format atid.me
      // Rumus: https://atid.me/adv.php?rk=[ID]&url=[ENCODED_URL]
      const encodedUrl = encodeURIComponent(targetUrl);
      return `https://atid.me/adv.php?rk=${ACCESSTRADE_ID}&url=${encodedUrl}`;
    }
  };

  return (
    <div className="mt-8 mb-6 px-0 md:px-0">
      
      {/* JUDUL SECTION */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-lg md:text-xl">
            🎬 Racun Shopee & Tiktok
            </h3>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
            VIRAL
            </span>
        </div>
      </div>

      {/* CONTAINER CAROUSEL */}
      <div 
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        {processedData.map((item, idx) => (
          <a
            key={idx}
            href={getLink(item)} 
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-shrink-0 w-36 md:w-40 h-64 md:h-72 bg-gray-200 rounded-xl overflow-hidden snap-start shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* GAMBAR */}
            <img 
                src={item.displayImage} 
                alt={item.displayName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                onError={(e: any) => e.target.src = 'https://via.placeholder.com/150x200?text=No+Image'} 
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {/* LABEL PLATFORM */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm z-10 flex items-center gap-1 ${
              item.platform === 'shopee' ? 'bg-[#ee4d2d]' : 'bg-[#00f2ea]'
            }`}>
              {item.platform === 'shopee' ? 'Shopee' : 'TikTok'}
            </div>

            {/* INFO PRODUK */}
            <div className="absolute bottom-0 left-0 w-full p-3 text-white z-10">
               {item.displayPrice !== 'Cek Harga' && (
                   <p className="text-xs font-bold text-yellow-400 mb-0.5">
                    {typeof item.displayPrice === 'number' 
                        ? `Rp ${item.displayPrice.toLocaleString()}` 
                        : item.displayPrice}
                   </p>
               )}
              <p className="text-xs md:text-sm font-medium line-clamp-2 leading-tight opacity-95 group-hover:text-yellow-200 transition-colors">
                {item.displayName}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;