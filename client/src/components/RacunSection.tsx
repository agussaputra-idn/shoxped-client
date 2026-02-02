import React from 'react';

// --- Tipe Data Produk ---
interface ProductRacun {
  id: number | string;
  name: string;
  image: string;
  platform: 'shopee' | 'tiktok';
  price?: string | number; // Bisa string atau number
  originalUrl?: string; 
  shopeeLink?: string; // Tambahan agar sinkron dengan Home.tsx
  link?: string;       // Tambahan agar sinkron dengan Home.tsx
}

const RacunSection = ({ data = [] }: { data?: any[] }) => {
  
  // Fungsi untuk mendapatkan Link Akhir
  const getLink = (item: any) => {
    if (item.platform === 'tiktok') {
      return `https://www.tiktok.com/search?q=${encodeURIComponent(item.name || item.title)}`;
    } else {
      // PERBAIKAN: Ambil link yang sudah dikonversi oleh Home.tsx
      // Mencari properti 'shopeeLink' atau 'link' yang berisi atid.me
      return item.shopeeLink || item.link || item.originalUrl || '#'; 
    }
  };

  // Fungsi format harga jika tipenya number
  const displayPrice = (price: any) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    }
    return price;
  };

  return (
    <div className="w-full my-6 px-4 md:px-0">
      
      {/* JUDUL SECTION */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl md:text-1xl font-bold text-gray-800">
           Racun Shopee & Tiktok
        </h2>
        <span className="bg-red-100 text-red-600 text-xs font-bold px-1 py-0.5 rounded-full border border-red-200 animate-pulse">
           🔥 VIRAL
        </span>
      </div>

      {/* CONTAINER HORIZONTAL SCROLL */}
      <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {(data.length > 0 ? data : []).map((item, index) => (
          <a
            key={index}
            href={getLink(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-shrink-0 w-36 md:w-44 h-64 md:h-72 bg-gray-200 rounded-xl overflow-hidden snap-start shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* GAMBAR PRODUK (Full Cover) */}
            <img 
              src={item.image} 
              alt={item.name || item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* OVERLAY GRADASI */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {/* LABEL PLATFORM */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm z-10 flex items-center gap-1 ${
              item.platform === 'shopee' ? 'bg-[#ee4d2d]' : 'bg-black'
            }`}>
              {item.platform === 'shopee' ? 'Shopee' : 'TikTok'}
            </div>

            {/* INFO PRODUK (Bawah) */}
            <div className="absolute bottom-0 left-0 w-full p-3 text-white z-10">
              <p className="text-xs md:text-sm font-bold text-yellow-400 mb-0.5">
                {displayPrice(item.price || item.shopeePrice)}
              </p>
              <h3 className="text-xs md:text-sm font-medium line-clamp-2 leading-tight opacity-95 group-hover:text-yellow-200 transition-colors">
                {item.name || item.title}
              </h3>
            </div>
            
          </a>
        ))}
      </div>
    </div>
  );
};

export default RacunSection;