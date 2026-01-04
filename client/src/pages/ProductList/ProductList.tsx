import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- DATABASE PRODUK (DATA TETAP SAMA) ---
const PRODUCTS_DATA = [
  {
    id: 100,
    title: "INSPIRED Scarlett Whitening PARFUM Unisex Memories Dreamy 30ml",
    shopeePrice: 9000,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-8259u-mfvde9xs5vrgcc.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Viral", "Parfum"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/9fEMHXug6s",
  },
  {
    id: 114,
    title: "Rak Troli Plastik Serbaguna 3 Susun dengan Roda",
    shopeePrice: 25400,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-7rd6f-m711lm4pzape48.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Rumah", "Murah"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/6faki266CW",
  },
  {
    id: 195,
    title: "Stik Pewarna Rambut Penutup Uban (Tahan Air)",
    shopeePrice: 55400,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rasg-m45pcf6jy3km84.webp",
    location: "Jakarta",
    rating: 4.7,
    sold: 10000,
    tags: ["Kecantikan", "Viral"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/40ZzX8GFdJ",
  },
  {
    id: 188,
    title: "QME Timbangan Buah Digital 40kg Double Display",
    shopeePrice: 185800,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224x-miv1a4eh9ath2f.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Elektronik", "Pasar"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/5q1diV9GuY",
  },
  {
    id: 187,
    title: "Kipas Angin Mini Portable Turbo (Tahan 24 Jam)",
    shopeePrice: 33000,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-824h6-mfkzvdte02ru8e.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Elektronik", "Viral"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/5L5N7aBAvR",
  },
  {
    id: 167,
    title: "Tsurayya Khimar Jema Nonped Bahan Mazen Anti UV",
    shopeePrice: 204000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7r98o-ly9j0goazlrc70.webp",
    location: "Jakarta",
    rating: 5.0,
    sold: 10000,
    tags: ["Fashion", "Muslim"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/9zrCg9tPS1",
  },
  {
    id: 153,
    title: "Dephero Eau De Parfum Pria Tahan Lama",
    shopeePrice: 149000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224p-mfw2xns6dhjga2.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Parfum", "Pria"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/2VlBkNLxfL",
  },
  {
    id: 145,
    title: "Bali Surfers Perfume - Blue Point For Her 100ML",
    shopeePrice: 110000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81ztg-mekwhgbtwyki42.webp",
    location: "Bali",
    rating: 4.9,
    sold: 10000,
    tags: ["Parfum", "Wanita"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3qGZKpGsxT",
  },
  {
    id: 144,
    title: "Blouse Kaftan Tunik Viscose Aruna (Kondangan)",
    shopeePrice: 85700,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7r992-lpsqagak3jjm70.webp",
    location: "Pekalongan",
    rating: 4.7,
    sold: 10000,
    tags: ["Fashion", "Wanita"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3fx98WHWIQ",
  },
  {
    id: 122,
    title: "KOMIN Sepatu Sandal Selop Baim Pria EVA Casual",
    shopeePrice: 49900,
    image: "https://down-tx-id.img.susercontent.com/id-11134201-23030-4pv5ffwsfvov35.webp",
    location: "Bogor",
    rating: 4.8,
    sold: 10000,
    tags: ["Sepatu", "Pria"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/5L5N7aBAuO",
  },
  {
    id: 120,
    title: "Hania Oneset Rayon Celana Kulot + Atasan Rempel",
    shopeePrice: 96500,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbk8-m9od14clkj0314.webp",
    location: "Solo",
    rating: 4.8,
    sold: 10000,
    tags: ["Fashion", "Muslim"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/7fTHts2IAo",
  },
  {
    id: 199,
    title: "PAKET HEMAT 5 Pack Detergen Sayang Bubuk",
    shopeePrice: 19800,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbk4-m8dzuxuoxvyj72.webp",
    location: "Surabaya",
    rating: 5.0,
    sold: 10000,
    tags: ["Rumah Tangga", "Murah"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/4fpgKMDiHV",
  },
  {
    id: 110,
    title: "Ecentio Kotak Makan Anti Tumpah 1100ml Free Sendok",
    shopeePrice: 35900,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-82250-mips57lepczrf8.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Dapur", "Bekal"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8fLp5hyU8q",
  },
  {
    id: 108,
    title: "Tumbler Stainless Steel 473ml Tahan Panas Dingin",
    shopeePrice: 71300,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81ztd-mepdnomeywow25.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Dapur", "Tumbler"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8Kiyh5zkok",
  },
  {
    id: 109,
    title: "Amicaa Sweatpants Loose Highwaist Celana Panjang",
    shopeePrice: 52000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbkb-m84zpdsclpfvfc.webp",
    location: "Bandung",
    rating: 4.8,
    sold: 10000,
    tags: ["Fashion", "Celana"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8V2OtOz7Tn",
  },
  {
    id: 148,
    title: "WANNAFIT Pulley Cable System Set Alat Gym Rumahan",
    shopeePrice: 190000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7ra0i-mdlnijslzf041e.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 8000,
    tags: ["Olahraga", "Gym"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/1gC4kqP8M6",
  },
  {
    id: 118,
    title: "SOMBONG 5-in-1 Sunscreen Spray SPF 30",
    shopeePrice: 78000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224z-mgyjbjxt9fkb4b.webp",
    location: "Jakarta",
    rating: 4.7,
    sold: 8000,
    tags: ["Skincare", "Viral"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/7KqRVG3Yqi",
  },
  {
    id: 139,
    title: "Biji Kopi Pure Arabica 500 Gram Commercial Grade",
    shopeePrice: 99300,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81zti-mejtghsqc6x3f9.webp",
    location: "Aceh",
    rating: 4.9,
    sold: 7000,
    tags: ["Makanan", "Kopi"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/2qO28zKgzB",
  },
  {
    id: 143,
    title: "Aeiso Sepatu Sport Casual Fashionable (Kerja & Jalan)",
    shopeePrice: 369800,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224t-mh1npiatcm4p9c.webp",
    location: "Tangerang",
    rating: 4.8,
    sold: 6000,
    tags: ["Sepatu", "Sport"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3VdiwDI9dN",
  },
  {
    id: 141,
    title: "Velixir Demeter Eau de Parfum for Unisex",
    shopeePrice: 195000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81ztl-mf57uh8oy0pb2b.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 5000,
    tags: ["Parfum", "Unisex"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3B0sXbJQJH",
  }
];

// --- ICONS (MARKETPLACE GRADE) ---
const Icons = {
    // Logo "Solid Bag" ala Shopee/Tokopedia
    LogoMarketplace: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
             <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 12v3" className="text-white" />
        </svg>
    ),
    Star: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    ),
    Search: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    Fire: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white animate-pulse">
            <path d="M12 2c-3 3-3 5-1 8-2-1-3-3-3-5 0 4 3 7 3 11 0 2-1 4-3 5 5 0 8-3 8-7 0-3-2-6-4-12z" />
        </svg>
    ),
    Bolt: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
    Shield: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Cart: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    )
};

// --- KOMPONEN UTAMA ---
const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('name') || '';
  const [products, setProducts] = useState(PRODUCTS_DATA);

  // LOGIKA SMART PRICE
  useEffect(() => {
    let dataToDisplay = PRODUCTS_DATA;
    if (query) {
      const lower = query.toLowerCase();
      dataToDisplay = PRODUCTS_DATA.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    const enhancedData = dataToDisplay.map(p => {
        const tiktokPrice = (p as any).tiktokPrice || Math.floor(p.shopeePrice * (Math.random() * (1.05 - 0.95) + 0.95) / 100) * 100;
        return {
            ...p,
            tiktokPrice: tiktokPrice,
            tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(p.title)}` 
        };
    });
    setProducts(enhancedData);
  }, [query]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleReset = () => navigate('/');

  const flashSaleItems = query ? [] : products.filter(p => p.isFlashSale);
  const regularItems = query ? products : products.filter(p => !p.isFlashSale);

  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-[104px]'>
      
      {/* --- BAGIAN 1: TOP BAR (ANNOUNCEMENT) --- */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white h-9 flex items-center justify-center shadow-md">
         <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-bold tracking-wide">
            
            {/* Kiri: Hot Deals */}
            <div className="flex items-center gap-4 animate-pulse">
                <span className="flex items-center gap-1.5 text-orange-400">
                    <Icons.Fire /> HOT DEALS HARI INI
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-yellow-300">
                    <Icons.Bolt /> FLASH SALE EXTRA
                </span>
            </div>

            {/* Kanan: Jaminan */}
            <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1.5">
                    <Icons.Shield /> 100% ORI
                </span>
                <span className="hidden sm:inline">GRATIS ONGKIR</span>
            </div>

         </div>
      </div>

      {/* --- BAGIAN 2: NAVBAR UTAMA (LOGO & SEARCH) --- */}
      <nav className="fixed top-9 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 h-20 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-6">
            
            {/* LOGO MARKETPLACE GRADE */}
            <div onClick={handleReset} className="flex items-center gap-2 cursor-pointer group shrink-0">
                <Icons.LogoMarketplace />
                <div className="flex flex-col leading-none justify-center">
                    <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-orange-600 transition-colors">
                        SHOX<span className="text-orange-600">PED</span>
                    </span>
                </div>
            </div>

            {/* SEARCH BAR MODERN */}
            <div className="flex-1 max-w-2xl mx-auto relative group hidden sm:block">
                <div className="flex">
                    <input 
                        type="text" 
                        placeholder="Cari produk termurah di Shopee & TikTok..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-l-lg py-3 px-5 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner"
                        readOnly
                    />
                    <button className="bg-orange-600 text-white px-6 rounded-r-lg hover:bg-orange-700 transition font-bold">
                        <Icons.Search />
                    </button>
                </div>
            </div>

            {/* CART & MENU */}
            <div className="flex items-center gap-4">
                <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
                    <Icons.Cart />
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-1.5 rounded-full border border-white">2</span>
                </div>
            </div>
        </div>
      </nav>

      <div className='container mx-auto px-4 max-w-6xl mt-8'>
        
        {/* HERO BANNER */}
        {!query && (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 md:py-16 px-6 mb-10 text-center shadow-2xl mx-2 md:mx-0 border-t-4 border-orange-600">
                
                <div className="relative z-10 space-y-5">
                    <span className="inline-block px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg animate-bounce">
                        NEW ARRIVAL
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                        SEMUA ADA. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">SEMUA MURAH.</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Bandingkan harga Shopee & TikTok dalam satu aplikasi. Temukan selisih harga hingga 50% sekarang juga.
                    </p>
                </div>
            </div>
        )}

        {/* --- KONTEN PRODUK (FLASH SALE) --- */}
        {!query && flashSaleItems.length > 0 && (
          <div className='mb-12'>
            <div className='flex items-center justify-between mb-6 px-2'>
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-1.5 rounded-md">
                        <Icons.Bolt />
                    </div>
                    <div>
                        <h2 className='text-xl font-black text-gray-900 uppercase tracking-tight'>Flash Sale</h2>
                        <p className="text-[10px] font-bold text-red-500 animate-pulse">Sisa Waktu: 02:45:12</p>
                    </div>
                </div>
                <span className="text-xs font-bold text-orange-600 hover:text-orange-800 cursor-pointer">Lihat Semua &rarr;</span>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
              {flashSaleItems.map((item) => (
                <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} />
              ))}
            </div>
          </div>
        )}

        {/* --- KONTEN PRODUK (REKOMENDASI) --- */}
        <div className="px-2">
            {!query && regularItems.length > 0 && (
                <div className='flex items-center gap-2 mb-6 border-b border-gray-200 pb-3'>
                    <h2 className='text-lg font-bold text-gray-900'>Rekomendasi Untukmu</h2>
                </div>
            )}

            {regularItems.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6'>
                    {regularItems.map((item) => (
                        <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-20'>
                    <h3 className='text-lg font-bold text-gray-800'>Tidak Ditemukan</h3>
                    <button onClick={handleReset} className='mt-4 px-6 py-2 bg-black text-white rounded-full text-xs font-bold'>
                        Reset
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU PRODUK (Updated Layout) ---
const ProductCardItem = ({ item, formatRupiah }: any) => {
    const isShopeeCheaper = item.shopeePrice <= item.tiktokPrice;

    return (
        <div className='group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative'>
            
            {/* Image Area */}
            <div className='relative aspect-square bg-gray-100 overflow-hidden'>
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                    onError={(e:any) => e.target.src = 'https://via.placeholder.com/400'}
                />
                
                {/* Badge Sold */}
                <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent'>
                    <div className="flex items-center gap-1 text-white text-[9px] font-bold">
                        <Icons.Star /> {item.rating} • {item.sold/1000}RB+ Terjual
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='p-3 flex flex-col flex-grow'>
                <h3 className='font-bold text-gray-800 text-xs md:text-sm mb-3 leading-snug line-clamp-2 min-h-[2.4em] group-hover:text-orange-600 transition-colors'>
                    {item.title}
                </h3>

                {/* Price Blocks */}
                <div className="mt-auto space-y-1.5 mb-3">
                    {/* Shopee Row */}
                    <div className={`flex justify-between items-center px-2 py-1.5 rounded border ${isShopeeCheaper ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent'}`}>
                        <span className="text-[10px] font-extrabold text-gray-500 uppercase">Shopee</span>
                        <span className={`text-xs font-bold ${isShopeeCheaper ? 'text-orange-600' : 'text-gray-400'}`}>
                            {formatRupiah(item.shopeePrice)}
                        </span>
                    </div>

                    {/* TikTok Row */}
                    <div className={`flex justify-between items-center px-2 py-1.5 rounded border ${!isShopeeCheaper ? 'bg-gray-50 border-gray-200' : 'bg-white border-transparent'}`}>
                         <span className="text-[10px] font-extrabold text-gray-500 uppercase">TikTok</span>
                        <span className={`text-xs font-bold ${!isShopeeCheaper ? 'text-black' : 'text-gray-400'}`}>
                            {formatRupiah(item.tiktokPrice)}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className='grid grid-cols-2 gap-2'>
                    <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className='bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-[10px] md:text-xs font-bold text-center transition shadow-md'>
                        Beli Shopee
                    </a>
                    <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-[10px] md:text-xs font-bold text-center transition shadow-md'>
                        Beli TikTok
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductList;