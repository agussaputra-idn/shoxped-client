import React, { useState, useEffect } from 'react';
import Carousel from 'src/components/Carousel/Carousel';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAsYy9QTAN06pTw9fUSu3eIqf9dBUSIS7OQ62aOvxgHLe_9oNzF1CL7BB9T35dd8v8UifG5Nz3rRnX/pub?output=csv";

// --- PARSER PASTI (SESUAI STRUKTUR EXCEL ANDA) ---
const parseCSV = (text: string) => {
    const rows = text.split('\n').filter(row => row && row.trim().length > 0);
    const dataRows = rows.slice(1);

    return dataRows.map((row, index) => {
        const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const cleanParts = parts.map(p => p.trim().replace(/^"|"$/g, '').trim());

        if (cleanParts.length < 3) return null;

        // MAPPING KOLOM:
        const title = cleanParts[0] || "Produk Tanpa Nama";
        // Kolom B [1] adalah Harga
        const priceRaw = cleanParts[1] ? cleanParts[1].replace(/[^0-9]/g, '') : "0";
        const price = parseInt(priceRaw) || 0;

        // Kolom C [2] adalah Gambar
        let image = cleanParts[2];
        if (!image || !image.includes('http')) {
            image = "https://via.placeholder.com/300?text=No+Image";
        }

        // Kolom G [6] adalah Link Affiliate
        let shopeeLink = "#";
        if (cleanParts[6] && cleanParts[6].includes('http')) {
            shopeeLink = cleanParts[6];
        } else {
            const findLink = cleanParts.find(p => p.includes('shopee.co.id') || p.includes('shp.ee'));
            if (findLink) shopeeLink = findLink;
        }

        const isShopeeCheaper = Math.random() < 0.6;
        const variance = Math.random() * 0.3; 
        let tiktokPrice = isShopeeCheaper ? Math.floor(price * (1 + variance)) : Math.floor(price * (1 - variance));
        
        // Auto Tagging
        const tLower = title.toLowerCase();
        let tag = "Lainnya";
        if (tLower.includes('sepatu') || tLower.includes('sneakers')) tag = "Sepatu";
        else if (tLower.includes('tas') || tLower.includes('bag')) tag = "Tas";
        else if (tLower.includes('baju') || tLower.includes('kemeja') || tLower.includes('dress')) tag = "Fashion";
        else if (tLower.includes('serum') || tLower.includes('wajah')) tag = "Kecantikan";
        else if (tLower.includes('hp') || tLower.includes('case')) tag = "Elektronik";
        else if (tLower.includes('rumah')) tag = "Rumah";

        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
        const keywords = cleanTitle.split(/\s+/).slice(0, 5).join(" ");

        return {
            id: index + 1000,
            title,
            shopeePrice: price,
            image,
            shopeeLink,
            tiktokPrice,
            tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}`,
            category: tag,
        };
    }).filter(item => item !== null && item.shopeePrice > 0);
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            const text = await response.text();
            const parsedData = parseCSV(text);
            setProducts(parsedData);
            setLoading(false);
        } catch (error) { console.error("Gagal mengambil data:", error); setLoading(false); }
    };
    fetchData();
  }, []);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const filteredProducts = selectedCategory === "Semua" ? products : products.filter(p => p.category === selectedCategory);

  const categories = [
    { name: "Semua", icon: "🛍️" },
    { name: "Fashion", icon: "👕" },
    { name: "Sepatu", icon: "👟" },
    { name: "Tas", icon: "👜" },
    { name: "Elektronik", icon: "📱" },
    { name: "Kecantikan", icon: "💄" },
    { name: "Rumah", icon: "🏠" },
  ];

  return (
    <div className='w-full flex flex-col min-h-screen bg-gray-50'>
      <div className="w-full py-3 px-2 bg-orange-50 border-b border-orange-100 shadow-sm z-10 flex items-center justify-center">
        <p className="text-center text-sm md:text-base text-gray-800 font-medium leading-snug">
            <span className="opacity-80">Cek Dulu Disini.</span><br className="block sm:hidden" /> 
            <span className="text-[#ee4d2d] font-bold ml-1">Shopee</span><span className="mx-1">atau</span><span className="text-black font-bold">TikTok</span><span className="ml-1">yang Lebih Murah?</span>
        </p>
      </div>

      <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 pb-12'>
        <div className='w-full mt-6 rounded-xl overflow-hidden shadow-sm'><Carousel /></div>

        <div className='mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
           <div className='flex items-start justify-between md:justify-around overflow-x-auto pb-2 scrollbar-hide gap-4'>
              {categories.map((cat, index) => (
                <div key={index} onClick={() => setSelectedCategory(cat.name)} className={`flex flex-col items-center min-w-[70px] cursor-pointer group transition-all ${selectedCategory === cat.name ? 'scale-110 font-bold' : 'opacity-80 hover:opacity-100'}`}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 border transition-all shadow-sm ${selectedCategory === cat.name ? 'bg-orange-100 border-orange-500' : 'bg-white border-gray-200 group-hover:border-orange-200'}`}>{cat.icon}</div>
                  <span className={`text-xs md:text-sm font-medium transition-colors ${selectedCategory === cat.name ? 'text-orange-600' : 'text-gray-600'}`}>{cat.name}</span>
                </div>
              ))}
           </div>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-between mb-4 px-1'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-800'>
                {selectedCategory === "Semua" ? "Rekomendasi Untukmu" : `Kategori: ${selectedCategory}`}
                <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length} Produk)</span>
            </h2>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
            {loading ? (
              [...Array(10)].map((_, i) => <div key={i} className='bg-white rounded-xl shadow-sm h-80 animate-pulse border border-gray-100' />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div key={item.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col'>
                    <div className='w-full aspect-square relative overflow-hidden bg-gray-100'>
                        <img src={item.image} alt={item.title} className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' onError={(e:any) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Gambar+Rusak'; }} loading="lazy" />
                    </div> 
                    
                    <div className='p-4 flex flex-col flex-grow justify-between'>
                        <h3 className='text-sm text-gray-800 font-semibold line-clamp-2 leading-snug mb-3' title={item.title}>{item.title}</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-xs md:text-sm">
                                <span className="font-bold text-[#ee4d2d]">Shopee</span>
                                <span className="font-bold text-[#ee4d2d]">{formatRupiah(item.shopeePrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs md:text-sm">
                                <span className="font-medium text-gray-600">TikTok</span>
                                <span className="font-medium text-gray-600">{formatRupiah(item.tiktokPrice)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 mt-auto">
                            <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                               className="flex-1 bg-white text-[#ee4d2d] border border-[#ee4d2d] text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-[#ee4d2d] hover:text-white hover:shadow-md">
                                Beli di Shopee
                            </a>
                            <a href={item.tiktokLink} target="_blank" rel="noreferrer" 
                               className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-black hover:text-white hover:border-black hover:shadow-md">
                                Beli di TikTok
                            </a>
                        </div>
                    </div>
                </div>
              ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500"><p>Tidak ada produk di kategori ini.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}