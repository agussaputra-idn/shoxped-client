import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- KONFIGURASI ---
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAsYy9QTAN06pTw9fUSu3eIqf9dBUSIS7OQ62aOvxgHLe_9oNzF1CL7BB9T35dd8v8UifG5Nz3rRnX/pub?output=csv";

// --- ICONS (SVG) ---
const Icons = {
    Logo: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
            <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm-9-1a2 2 0 012-2 2 2 0 012 2v1h-4V6zm0 4a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0z"/>
            <path stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9 13l2 2 4-4" fill="none"/>
        </svg>
    ),
    Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    Fire: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-pulse"><path d="M12 2c-3 3-3 5-1 8-2-1-3-3-3-5 0 4 3 7 3 11 0 2-1 4-3 5 5 0 8-3 8-7 0-3-2-6-4-12z" /></svg>,
    Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
};

// --- KATEGORI ---
const CATEGORIES = [
    { name: "Semua", icon: "🛍️", tag: "All" },
    { name: "Fashion", icon: "👕", tag: "Fashion" },
    { name: "Sepatu", icon: "👟", tag: "Sepatu" },
    { name: "Tas", icon: "👜", tag: "Tas" },
    { name: "Kecantikan", icon: "💄", tag: "Kecantikan" },
    { name: "Elektronik", icon: "📱", tag: "Elektronik" },
    { name: "Rumah", icon: "🏠", tag: "Rumah Tangga" },
    { name: "Makanan", icon: "🍔", tag: "Makanan" },
];

// --- PARSER CSV OPTIMIZED ---
const parseCSV = (text: string) => {
    // Membagi baris dan menghapus baris kosong
    const rows = text.split('\n').filter(row => row && row.trim().length > 0);
    
    // Hapus header (baris pertama)
    const dataRows = rows.slice(1);

    return dataRows.map((row, index) => {
        // Regex ini lebih aman menangani koma di dalam tanda kutip (jika ada)
        // Tapi untuk simplifikasi, kita asumsikan struktur: Judul, Harga, Image, Link
        
        // Split manual namun kita akan coba menggabungkan kembali jika formatnya salah
        // Asumsi: Kolom terakhir pasti Link Shopee, Kolom sebelumnya Image, Kolom sebelumnya Harga
        const parts = row.split(',');

        // Jika array < 4, data mungkin rusak, return null dulu nanti difilter
        if (parts.length < 3) return null;

        // Strategi: Ambil data dari BELAKANG (karena link & harga formatnya pasti, judul bisa panjang/berkoma)
        let linkShopee = "";
        let linkImage = "";
        let priceRaw = "0";
        let titleParts = [];

        // Mencari Link Shopee (biasanya ada 'http' atau 'shopee')
        // Ambil elemen terakhir yang mengandung 'http'
        let linkIndex = parts.length - 1;
        while (linkIndex >= 0) {
            if (parts[linkIndex].includes('http')) {
                linkShopee = parts[linkIndex].trim();
                break;
            }
            linkIndex--;
        }

        // Jika link ketemu, elemen sebelumnya adalah Image (biasanya http juga)
        // Jika tidak ada image link, pakai placeholder
        if (linkIndex > 0 && parts[linkIndex - 1].includes('http')) {
             linkImage = parts[linkIndex - 1].trim();
             // Elemen sebelumnya lagi adalah Harga
             priceRaw = parts[linkIndex - 2];
             // Sisanya di depan adalah Judul
             titleParts = parts.slice(0, linkIndex - 2);
        } else {
             // Fallback jika struktur kolom berantakan, pakai logika index sederhana
             // Asumsi Sheet: [0] Judul, [1] Harga, [2] Gambar, [3] Link
             titleParts = [parts[0]];
             priceRaw = parts[1];
             linkImage = parts[2];
             linkShopee = parts.slice(3).join(''); // Gabung sisanya kalau link terpotong koma
        }

        // Bersihkan data
        const title = titleParts.join(',').replace(/^"|"$/g, '').trim();
        const price = parseInt((priceRaw || "0").replace(/[^0-9]/g, '')) || 0;

        // --- HARGA TIKTOK SIMULASI (Marketing) ---
        // Jika ingin harga real, ganti logika ini dengan ambil dari kolom CSV baru
        const isShopeeCheaper = Math.random() < 0.6; // 60% peluang Shopee lebih murah
        const variance = Math.random() * 0.3; 
        let tiktokPrice = isShopeeCheaper ? Math.floor(price * (1 + variance)) : Math.floor(price * (1 - variance));

        // --- AUTO TAGGING ---
        const tLower = title.toLowerCase();
        let tag = "Umum";
        if (tLower.includes('sepatu') || tLower.includes('sneakers')) tag = "Sepatu";
        else if (tLower.includes('tas') || tLower.includes('bag')) tag = "Tas";
        else if (tLower.includes('baju') || tLower.includes('kemeja') || tLower.includes('dress')) tag = "Fashion";
        else if (tLower.includes('serum') || tLower.includes('wajah') || tLower.includes('lipstick')) tag = "Kecantikan";
        else if (tLower.includes('makan') || tLower.includes('snack')) tag = "Makanan";
        else if (tLower.includes('rumah') || tLower.includes('dapur')) tag = "Rumah Tangga";
        else if (tLower.includes('hp') || tLower.includes('bluetooth') || tLower.includes('kabel')) tag = "Elektronik";

        // Generate Search Link TikTok
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
        const keywords = cleanTitle.split(" ").filter(w => w.length > 2).slice(0, 8).join(" "); // Ambil 8 kata relevan

        return {
            id: index + 1000,
            title,
            shopeePrice: price,
            image: linkImage,
            shopeeLink: linkShopee,
            tiktokPrice,
            tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}`,
            tags: ["All", tag], // "All" agar muncul di default
            isFlashSale: Math.random() < 0.15, // 15% produk jadi flash sale
            location: ["Jakarta", "Surabaya", "Bandung", "Batam"][Math.floor(Math.random() * 4)],
            rating: (Math.random() * 0.5 + 4.5).toFixed(1),
            sold: Math.floor(Math.random() * 2000) + 100
        };
    }).filter(item => item !== null && item.title !== ""); // Hapus data rusak
};

// --- MAIN COMPONENT ---
const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            const text = await response.text();
            const parsedData = parseCSV(text);
            setProducts(parsedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching sheet:", error);
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.tags.includes(selectedCategory);
      return matchSearch && matchCategory;
  });

  const flashSaleItems = products.filter(p => p.isFlashSale).slice(0, 5);
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // --- CAROUSEL COMPONENT (Mini version inside) ---
  const HeroCarousel = ({ items }: any) => {
      const [idx, setIdx] = useState(0);
      useEffect(() => {
          if (items.length === 0) return;
          const interval = setInterval(() => setIdx(prev => (prev + 1) % items.length), 4000);
          return () => clearInterval(interval);
      }, [items]);
      
      if (items.length === 0) return null;
      const item = items[idx];

      return (
        <div className="relative w-full h-[200px] md:h-[280px] bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl overflow-hidden shadow-lg mb-8 flex items-center">
             {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="container mx-auto px-6 flex items-center justify-between relative z-10">
                <div className="text-white max-w-lg z-20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-yellow-400 text-red-900 text-[10px] md:text-xs font-black px-2 py-1 rounded uppercase tracking-wider animate-pulse">⚡ Flash Sale</span>
                    </div>
                    <h2 className="text-lg md:text-3xl font-black leading-tight line-clamp-2 mb-2 drop-shadow-md">
                        {item.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="bg-white text-orange-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-md text-sm md:text-base">
                            {formatRupiah(item.shopeePrice)}
                        </div>
                        <a href={item.shopeeLink} target="_blank" rel="noreferrer" className="bg-black/90 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-lg font-bold hover:bg-black transition text-sm md:text-base">
                            Beli Sekarang
                        </a>
                    </div>
                </div>
                {/* Image */}
                <div className="hidden md:block w-48 h-48 bg-white p-2 rounded-lg shadow-2xl rotate-3 transform hover:rotate-0 transition duration-500">
                    <img src={item.image} alt="Flash Sale" className="w-full h-full object-cover rounded" onError={(e:any) => e.target.src='https://via.placeholder.com/300?text=No+Image'} />
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-[110px]'>
      
      {/* HEADER & NAVBAR (Sama seperti sebelumnya) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white h-9 flex items-center justify-center shadow-md">
         <div className="container px-4 flex justify-between items-center text-[10px] font-bold tracking-wide">
            <span className="flex items-center gap-1.5 text-orange-400"><Icons.Fire /> HOT DEALS</span>
            <span className="flex items-center gap-1.5"><Icons.Shield /> 100% ORI</span>
         </div>
      </div>

      <nav className="fixed top-9 left-0 right-0 z-40 bg-white border-b border-gray-200 py-3 md:h-20 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
            <div onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="flex items-center gap-2 cursor-pointer group">
                <Icons.Logo />
                <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 hidden md:block">
                    Shox<span className="text-orange-600">ped</span>
                </span>
            </div>
            <div className="flex-1 max-w-2xl">
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:border-orange-500 transition-all bg-gray-50">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari produk..." 
                        className="flex-1 bg-transparent border-none py-2 px-4 text-sm focus:ring-0 outline-none" 
                    />
                    <button className="bg-orange-600 px-4 text-white"><Icons.Search /></button>
                </div>
            </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className='container mx-auto px-4 max-w-6xl mt-6'>
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
        ) : (
            <>
                {!searchTerm && <HeroCarousel items={flashSaleItems} />}

                {/* KATEGORI */}
                {!searchTerm && (
                    <div className="flex overflow-x-auto gap-4 pb-4 mb-6 scrollbar-hide">
                        {CATEGORIES.map((cat, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedCategory(cat.tag)}
                                className={`flex flex-col items-center min-w-[70px] cursor-pointer transition-all ${selectedCategory === cat.tag ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl mb-1 ${selectedCategory === cat.tag ? 'bg-orange-100 border-orange-500' : 'bg-white border-gray-200'}`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-[10px] font-bold ${selectedCategory === cat.tag ? 'text-orange-600' : 'text-gray-500'}`}>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* GRID PRODUK */}
                <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center justify-between'>
                    <span>{searchTerm ? `Hasil: "${searchTerm}"` : (selectedCategory !== "All" ? selectedCategory : "Rekomendasi")}</span>
                </h2>
                
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4'>
                    {filteredProducts.map((item:any) => (
                        <div key={item.id} className='bg-white rounded-lg border border-gray-200 hover:border-orange-500 overflow-hidden hover:shadow-lg transition-all group'>
                            <div className='relative aspect-square bg-gray-100'>
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className='w-full h-full object-cover'
                                    onError={(e:any) => e.target.src = 'https://via.placeholder.com/300?text=Produk'}
                                    loading="lazy"
                                />
                                {item.isFlashSale && <div className='absolute top-0 right-0 bg-yellow-400 text-red-600 text-[9px] font-black px-2 py-0.5'>⚡ FLASH</div>}
                            </div>
                            <div className='p-3'>
                                <h3 className='text-xs font-medium text-gray-800 mb-2 line-clamp-2 h-[2.5em]' title={item.title}>{item.title}</h3>
                                <div className="space-y-1 text-[10px]">
                                    <div className={`flex justify-between font-bold ${item.shopeePrice <= item.tiktokPrice ? 'text-orange-600' : 'text-gray-400'}`}>
                                        <span>Shopee</span> <span>{formatRupiah(item.shopeePrice)}</span>
                                    </div>
                                    <div className={`flex justify-between font-bold ${item.tiktokPrice < item.shopeePrice ? 'text-black' : 'text-gray-400'}`}>
                                        <span>TikTok</span> <span>{formatRupiah(item.tiktokPrice)}</span>
                                    </div>
                                </div>
                                <a href={item.shopeeLink} target="_blank" className="block mt-3 bg-orange-50 text-orange-700 text-[10px] font-bold py-1.5 text-center rounded border border-orange-200 hover:bg-orange-600 hover:text-white transition">
                                    Cek Shopee
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default ProductList;