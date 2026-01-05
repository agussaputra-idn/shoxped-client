import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- KONFIGURASI LINK CSV ---
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
    Cart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Filter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
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

// --- PARSER CSV ---
const parseCSV = (text: string) => {
    const rows = text.split('\n').filter(row => row.trim() !== '');
    
    return rows.slice(1).map((row, index) => {
        // Logika parsing untuk menangani koma dalam judul
        const parts = row.split(',');
        let titleParts = [];
        let i = 0;
        
        // Gabungkan bagian judul sampai ketemu format harga (angka)
        while (i < parts.length) {
            const part = parts[i].trim().replace(/^"|"$/g, '');
            if (i > 0 && part.match(/^(Rp)?\s*\d+(\.\d+)*$/)) break; 
            titleParts.push(part);
            i++;
        }
        
        const title = titleParts.join(', ').replace(/^"|"$/g, '');
        const priceRaw = parts[i] || "0";
        const image = parts[i+1] || ""; 
        
        // Cari link Shopee yang valid
        let shopeeLink = "#";
        for (let j = i; j < parts.length; j++) {
            if (parts[j] && parts[j].includes("shopee.co.id")) {
                shopeeLink = parts[j];
                break;
            }
        }

        const price = parseInt(priceRaw.replace(/[^0-9]/g, '')) || 0;

        // --- HARGA FEAR ---
        const isShopeeCheaper = Math.random() < 0.5;
        const variance = Math.random() * 0.3; 
        let tiktokPrice = price;
        if (isShopeeCheaper) {
            tiktokPrice = Math.floor(price * (1 + variance));
        } else {
            tiktokPrice = Math.floor(price * (1 - variance));
        }

        // --- TAGGING ---
        const tLower = title.toLowerCase();
        let tag = "Umum";
        if (tLower.includes('sepatu') || tLower.includes('sandal')) tag = "Sepatu";
        else if (tLower.includes('tas') || tLower.includes('ransel')) tag = "Tas";
        else if (tLower.includes('baju') || tLower.includes('kaos') || tLower.includes('gamis') || tLower.includes('dress')) tag = "Fashion";
        else if (tLower.includes('parfum') || tLower.includes('serum') || tLower.includes('cream')) tag = "Kecantikan";
        else if (tLower.includes('kopi') || tLower.includes('snack') || tLower.includes('makanan')) tag = "Makanan";
        else if (tLower.includes('rak') || tLower.includes('alat') || tLower.includes('rumah')) tag = "Rumah Tangga";
        else if (tLower.includes('hp') || tLower.includes('case') || tLower.includes('kabel')) tag = "Elektronik";

        // --- PERBAIKAN LINK TIKTOK (HAMPIR FULL TITLE) ---
        // 1. Bersihkan karakter aneh yang bisa merusak URL (seperti |, /, #, @)
        // 2. Ambil 12 kata pertama agar pencarian sangat spesifik tapi tidak terlalu panjang sampai error
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
        const keywords = cleanTitle.split(" ").filter(w => w.trim() !== "").slice(0, 12).join(" ");

        return {
            id: index + 1000,
            title: title,
            shopeePrice: price,
            image: image,
            location: ["Jakarta", "Bandung", "Surabaya", "Tangerang"][Math.floor(Math.random() * 4)],
            rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1),
            sold: Math.floor(Math.random() * 5000) + 50,
            tags: ["Viral", tag],
            isFlashSale: Math.random() < 0.2, 
            shopeeLink: shopeeLink,
            tiktokPrice: tiktokPrice,
            tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}` // Link lebih akurat
        };
    });
};

// --- COMPONENT CAROUSEL ---
const HeroCarousel = ({ items, formatRupiah }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 4000); 
        return () => clearInterval(interval);
    }, [items.length]);

    if (!items || items.length === 0) return null;
    const currentItem = items[currentIndex];

    return (
        <div className="relative w-full h-[200px] md:h-[300px] bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl overflow-hidden shadow-lg mb-8 flex items-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="container mx-auto px-6 flex items-center justify-between relative z-10">
                <div className="text-white max-w-lg">
                    <div className="flex items-center gap-2 mb-2 animate-bounce">
                        <span className="bg-yellow-400 text-red-700 text-xs font-black px-2 py-1 rounded uppercase">⚡ Flash Sale</span>
                        <span className="text-xs font-bold">Berakhir segera!</span>
                    </div>
                    <h2 className="text-xl md:text-4xl font-black leading-tight line-clamp-2 mb-2">
                        {currentItem.title}
                    </h2>
                    <div className="text-sm md:text-lg font-medium opacity-90 mb-4">
                        Diskon Spesial Hari Ini
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold shadow-md">
                            {formatRupiah(currentItem.shopeePrice)}
                        </div>
                        <a href={currentItem.shopeeLink} target="_blank" rel="noreferrer" className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                            Beli Sekarang
                        </a>
                    </div>
                </div>
                <div className="hidden md:block w-48 h-48 bg-white p-2 rounded-lg shadow-xl rotate-3 transform hover:rotate-0 transition duration-500">
                    <img src={currentItem.image} alt="Flash Sale" className="w-full h-full object-cover rounded" />
                </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {items.slice(0, 5).map((_: any, idx: number) => (
                    <div key={idx} className={`h-2 rounded-full transition-all ${idx === (currentIndex % 5) ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}></div>
                ))}
            </div>
        </div>
    );
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
            const uniqueProducts = Array.from(new Map(parsedData.map(item => [item['shopeeLink'], item])).values());
            setProducts(uniqueProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.tags.includes(selectedCategory);
      return matchSearch && matchCategory;
  });

  const flashSaleItems = products.filter(p => p.isFlashSale).slice(0, 5);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleReset = () => {
      setSearchTerm("");
      setSelectedCategory("All");
      navigate('/');
  };

  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-[150px] md:pt-[120px]'>
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white h-9 flex items-center justify-center shadow-md">
         <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-bold tracking-wide">
            <div className="flex items-center gap-4 animate-pulse">
                <span className="flex items-center gap-1.5 text-orange-400"><Icons.Fire /> HOT DEALS</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1.5"><Icons.Shield /> 100% ORI</span>
            </div>
         </div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-9 left-0 right-0 z-40 bg-white border-b border-gray-200 py-3 md:py-0 md:h-20 shadow-sm transition-all">
        <div className="container mx-auto px-4 h-full flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 gap-x-4">
            <div onClick={handleReset} className="flex items-center gap-2 cursor-pointer shrink-0 order-1 group">
                <div className="group-hover:scale-105 transition-transform">
                    <Icons.Logo />
                </div>
                <span className="text-2xl font-black tracking-tighter text-gray-900">
                    Shox<span className="text-orange-600">ped</span>
                </span>
            </div>
            <div className="w-full md:flex-1 md:max-w-3xl order-3 md:order-2">
                <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari produk murah..." 
                        className="flex-1 bg-gray-50 md:bg-white border-none py-2.5 px-4 text-sm focus:ring-0 w-full outline-none" 
                    />
                    <button className="bg-orange-600 px-4 md:px-6 flex items-center justify-center hover:bg-orange-700 transition">
                        <Icons.Search />
                    </button>
                </div>
            </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className='container mx-auto px-4 max-w-7xl mt-4'>
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Memuat data...</p>
            </div>
        ) : (
            <>
                {!searchTerm && <HeroCarousel items={flashSaleItems} formatRupiah={formatRupiah} />}

                {!searchTerm && (
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm overflow-x-auto mb-8">
                        <div className="flex md:grid md:grid-cols-8 gap-4 min-w-max md:min-w-0 pb-2 md:pb-0 justify-items-center">
                            {CATEGORIES.map((cat, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedCategory(cat.tag)}
                                    className={`flex flex-col items-center gap-2 cursor-pointer group w-20 md:w-auto transition-all ${selectedCategory === cat.tag ? 'scale-110 font-bold' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl transition-colors shadow-sm ${selectedCategory === cat.tag ? 'bg-orange-100 border-orange-500' : 'bg-gray-50 border-gray-200 group-hover:border-orange-300'}`}>
                                        {cat.icon}
                                    </div>
                                    <span className={`text-[10px] md:text-xs text-center ${selectedCategory === cat.tag ? 'text-orange-600' : 'text-gray-600'}`}>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className='bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm'>
                            <h2 className='text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex justify-between items-center'>
                                <span>{searchTerm ? `Hasil: "${searchTerm}"` : (selectedCategory !== "All" ? `Kategori: ${selectedCategory}` : "Rekomendasi Untukmu")}</span>
                                <span className="text-xs font-normal text-gray-500">{filteredProducts.length} Produk</span>
                            </h2>
                            
                            {filteredProducts.length > 0 ? (
                                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
                                    {filteredProducts.map((item:any) => (
                                        <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} />
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-20 text-gray-500'>
                                    <p className="text-lg font-bold">Produk tidak ditemukan</p>
                                    <p className="text-sm">Coba kata kunci lain atau ubah kategori.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

// --- PRODUCT CARD ---
const ProductCardItem = ({ item, formatRupiah }: any) => {
    const isShopeeCheaper = item.shopeePrice <= item.tiktokPrice;
    const handleImgError = (e: any) => { e.target.src = 'https://via.placeholder.com/400x400?text=Produk'; };

    return (
        <div className='bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-all duration-200 flex flex-col h-full overflow-hidden group cursor-pointer shadow-sm hover:shadow-md'>
            <div className='relative aspect-square bg-gray-100 overflow-hidden'>
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    onError={handleImgError}
                    loading="lazy"
                />
                {item.isFlashSale && <div className='absolute top-0 right-0 bg-yellow-400 text-red-600 text-[9px] md:text-[10px] font-black px-2 py-0.5 z-10'>⚡ FLASH SALE</div>}
            </div>
            <div className='p-2 md:p-3 flex flex-col flex-grow'>
                <h3 className='text-xs font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-orange-600 leading-snug' title={item.title}>
                    {item.title}
                </h3>
                <div className="mt-auto space-y-1.5 border-t border-gray-50 pt-2 text-[10px] md:text-xs">
                    <div className={`flex justify-between items-center ${isShopeeCheaper ? 'text-orange-600 font-bold bg-orange-50 px-1 rounded' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">Shopee</span>
                        <span>{formatRupiah(item.shopeePrice)}</span>
                    </div>
                    <div className={`flex justify-between items-center ${!isShopeeCheaper ? 'text-black font-bold bg-gray-100 px-1 rounded' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">TikTok</span>
                        <span>{formatRupiah(item.tiktokPrice)}</span>
                    </div>
                </div>
                <div className="flex gap-1 mt-3">
                    <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-orange-50 text-orange-700 text-[9px] md:text-[10px] font-bold py-2 text-center rounded-lg hover:bg-orange-600 hover:text-white transition border border-orange-200">
                        Beli di Shopee
                    </a>
                    <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-50 text-gray-700 text-[9px] md:text-[10px] font-bold py-2 text-center rounded-lg hover:bg-black hover:text-white transition border border-gray-200">
                        Beli di TikTok
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductList;