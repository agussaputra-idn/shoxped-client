import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- DATABASE PRODUK (DATA 20 PRODUK VIRAL DENGAN GAMBAR ASLI) ---
const PRODUCTS_DATA = [
  {
    id: 100,
    title: "INSPIRED Scarlett Whitening PARFUM Unisex Memories Dreamy 30ml",
    shopeePrice: 9000,
    tiktokPrice: 9500,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-8259u-mfvde9xs5vrgcc.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Viral", "Parfum"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/9fEMHXug6s",
    tiktokLink: "https://www.tiktok.com/search?q=Scarlett%20Whitening%20Parfum"
  },
  {
    id: 114,
    title: "Rak Troli Plastik Serbaguna 3 Susun dengan Roda (Rak Kosmetik/Dapur)",
    shopeePrice: 25400,
    tiktokPrice: 28000,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-7rd6f-m711lm4pzape48.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Rumah", "Murah"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/6faki266CW",
    tiktokLink: "https://www.tiktok.com/search?q=Rak%20Troli%20Plastik"
  },
  {
    id: 195,
    title: "Stik Pewarna Rambut Penutup Uban (Tahan Air & Keringat)",
    shopeePrice: 55400,
    tiktokPrice: 59000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rasg-m45pcf6jy3km84.webp",
    location: "Jakarta",
    rating: 4.7,
    sold: 10000,
    tags: ["Kecantikan", "Viral"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/40ZzX8GFdJ",
    tiktokLink: "https://www.tiktok.com/search?q=Stik%20Pewarna%20Rambut"
  },
  {
    id: 188,
    title: "QME Timbangan Buah Digital 40kg Double Display",
    shopeePrice: 185800,
    tiktokPrice: 190000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224x-miv1a4eh9ath2f.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Elektronik", "Pasar"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/5q1diV9GuY",
    tiktokLink: "https://www.tiktok.com/search?q=Timbangan%20Digital%2040kg"
  },
  {
    id: 187,
    title: "Kipas Angin Mini Portable Turbo (Tahan 24 Jam)",
    shopeePrice: 33000,
    tiktokPrice: 35000,
    image: "https://down-tx-id.img.susercontent.com/sg-11134201-824h6-mfkzvdte02ru8e.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Elektronik", "Viral"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/5L5N7aBAvR",
    tiktokLink: "https://www.tiktok.com/search?q=Kipas%20Angin%20Mini"
  },
  {
    id: 167,
    title: "Tsurayya Khimar Jema Nonped Bahan Mazen Anti UV (Free Cadar)",
    shopeePrice: 204000,
    tiktokPrice: 210000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7r98o-ly9j0goazlrc70.webp",
    location: "Jakarta",
    rating: 5.0,
    sold: 10000,
    tags: ["Fashion", "Muslim"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/9zrCg9tPS1",
    tiktokLink: "https://www.tiktok.com/search?q=Khimar%20Jema"
  },
  {
    id: 153,
    title: "Dephero Eau De Parfum Pria Tahan Lama (Disukai Wanita)",
    shopeePrice: 149000,
    tiktokPrice: 155000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-8224p-mfw2xns6dhjga2.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Parfum", "Pria"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/2VlBkNLxfL",
    tiktokLink: "https://www.tiktok.com/search?q=Dephero%20Parfum"
  },
  {
    id: 145,
    title: "Bali Surfers Perfume - Blue Point For Her 100ML",
    shopeePrice: 110000,
    tiktokPrice: 115000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81ztg-mekwhgbtwyki42.webp",
    location: "Bali",
    rating: 4.9,
    sold: 10000,
    tags: ["Parfum", "Wanita"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3qGZKpGsxT",
    tiktokLink: "https://www.tiktok.com/search?q=Bali%20Surfers%20Perfume"
  },
  {
    id: 144,
    title: "Blouse Kaftan Tunik Viscose Aruna (Atasan Kondangan)",
    shopeePrice: 85700,
    tiktokPrice: 90000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7r992-lpsqagak3jjm70.webp",
    location: "Pekalongan",
    rating: 4.7,
    sold: 10000,
    tags: ["Fashion", "Wanita"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3fx98WHWIQ",
    tiktokLink: "https://www.tiktok.com/search?q=Kaftan%20Tunik"
  },
  {
    id: 122,
    title: "KOMIN Sepatu Sandal Selop Baim Pria EVA Casual",
    shopeePrice: 49900,
    tiktokPrice: 55000,
    image: "https://down-tx-id.img.susercontent.com/id-11134201-23030-4pv5ffwsfvov35.webp",
    location: "Bogor",
    rating: 4.8,
    sold: 10000,
    tags: ["Sepatu", "Pria"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/5L5N7aBAuO",
    tiktokLink: "https://www.tiktok.com/search?q=Sandal%20Baim%20Pria"
  },
  {
    id: 120,
    title: "Hania Oneset Rayon Celana Kulot + Atasan Rempel",
    shopeePrice: 96500,
    tiktokPrice: 100000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbk8-m9od14clkj0314.webp",
    location: "Solo",
    rating: 4.8,
    sold: 10000,
    tags: ["Fashion", "Muslim"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/7fTHts2IAo",
    tiktokLink: "https://www.tiktok.com/search?q=Hania%20Oneset"
  },
  {
    id: 199,
    title: "PAKET HEMAT 5 Pack Detergen Sayang Bubuk",
    shopeePrice: 19800,
    tiktokPrice: 22000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbk4-m8dzuxuoxvyj72.webp",
    location: "Surabaya",
    rating: 5.0,
    sold: 10000,
    tags: ["Rumah Tangga", "Murah"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/4fpgKMDiHV",
    tiktokLink: "https://www.tiktok.com/search?q=Detergen%20Sayang"
  },
  {
    id: 110,
    title: "Ecentio Kotak Makan Anti Tumpah 1100ml Free Sendok",
    shopeePrice: 35900,
    tiktokPrice: 40000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-82250-mips57lepczrf8.webp",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Dapur", "Bekal"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8fLp5hyU8q",
    tiktokLink: "https://www.tiktok.com/search?q=Ecentio%20Lunch%20Box"
  },
  {
    id: 108,
    title: "Tumbler Stainless Steel 473ml Tahan Panas Dingin",
    shopeePrice: 71300,
    tiktokPrice: 75000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-81ztd-mepdnomeywow25.webp",
    location: "Jakarta",
    rating: 4.8,
    sold: 10000,
    tags: ["Dapur", "Tumbler"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8Kiyh5zkok",
    tiktokLink: "https://www.tiktok.com/search?q=Tumbler%20Stainless"
  },
  {
    id: 109,
    title: "Amicaa Sweatpants Loose Highwaist Celana Panjang Daily",
    shopeePrice: 52000,
    tiktokPrice: 55000,
    image: "https://down-tx-id.img.susercontent.com/id-11134207-7rbkb-m84zpdsclpfvfc.webp",
    location: "Bandung",
    rating: 4.8,
    sold: 10000,
    tags: ["Fashion", "Celana"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8V2OtOz7Tn",
    tiktokLink: "https://www.tiktok.com/search?q=Amicaa%20Sweatpants"
  },
  {
    "id": 148,
    "title": "WANNAFIT Pulley Cable System Set Alat Gym Rumahan",
    "shopeePrice": 190000,
    "tiktokPrice": 200000,
    "image": "https://down-tx-id.img.susercontent.com/id-11134207-7ra0i-mdlnijslzf041e.webp",
    "location": "Jakarta",
    "rating": 4.9,
    "sold": 8000,
    "tags": ["Olahraga", "Gym"],
    "isFlashSale": false,
    "shopeeLink": "https://s.shopee.co.id/1gC4kqP8M6",
    "tiktokLink": "https://www.tiktok.com/search?q=Pulley%20Cable%20System"
  },
  {
    "id": 118,
    "title": "SOMBONG 5-in-1 Sunscreen Spray SPF 30",
    "shopeePrice": 78000,
    "tiktokPrice": 85000,
    "image": "https://down-tx-id.img.susercontent.com/id-11134207-8224z-mgyjbjxt9fkb4b.webp",
    "location": "Jakarta",
    "rating": 4.7,
    "sold": 8000,
    "tags": ["Skincare", "Viral"],
    "isFlashSale": false,
    "shopeeLink": "https://s.shopee.co.id/7KqRVG3Yqi",
    "tiktokLink": "https://www.tiktok.com/search?q=SOMBONG%20Sunscreen"
  },
  {
    "id": 139,
    "title": "Biji Kopi Pure Arabica 500 Gram Commercial Grade",
    "shopeePrice": 99300,
    "tiktokPrice": 105000,
    "image": "https://down-tx-id.img.susercontent.com/id-11134207-81zti-mejtghsqc6x3f9.webp",
    "location": "Aceh",
    "rating": 4.9,
    "sold": 7000,
    "tags": ["Makanan", "Kopi"],
    "isFlashSale": false,
    "shopeeLink": "https://s.shopee.co.id/2qO28zKgzB",
    "tiktokLink": "https://www.tiktok.com/search?q=Biji%20Kopi%20Arabica"
  },
  {
    "id": 143,
    "title": "Aeiso Sepatu Sport Casual Fashionable (Kerja & Jalan)",
    "shopeePrice": 369800,
    "tiktokPrice": 380000,
    "image": "https://down-tx-id.img.susercontent.com/id-11134207-8224t-mh1npiatcm4p9c.webp",
    "location": "Tangerang",
    "rating": 4.8,
    "sold": 6000,
    "tags": ["Sepatu", "Sport"],
    "isFlashSale": false,
    "shopeeLink": "https://s.shopee.co.id/3VdiwDI9dN",
    "tiktokLink": "https://www.tiktok.com/search?q=Sepatu%20Aeiso"
  },
  {
    "id": 141,
    "title": "Velixir Demeter Eau de Parfum for Unisex",
    "shopeePrice": 195000,
    "tiktokPrice": 200000,
    "image": "https://down-tx-id.img.susercontent.com/id-11134207-81ztl-mf57uh8oy0pb2b.webp",
    "location": "Jakarta",
    "rating": 4.9,
    "sold": 5000,
    "tags": ["Parfum", "Unisex"],
    "isFlashSale": false,
    "shopeeLink": "https://s.shopee.co.id/3B0sXbJQJH",
    "tiktokLink": "https://www.tiktok.com/search?q=Velixir%20Demeter"
  }
];

// --- ICONS (SVG MURNI SUPAYA TIDAK PERLU INSTALL LIBRARY) ---
const Icons = {
    Logo: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    Search: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    Star: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    ),
    Trending: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-orange-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    )
};

// --- MESIN LOGIKA TOKO ---
const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('name') || '';
  const [products, setProducts] = useState(PRODUCTS_DATA);

  useEffect(() => {
    if (query) {
      const lower = query.toLowerCase();
      const filtered = PRODUCTS_DATA.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
      setProducts(filtered);
    } else {
      setProducts(PRODUCTS_DATA);
    }
  }, [query]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleReset = () => {
    navigate('/');
  };

  const handleImageError = (e: any) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=Produk+Shopee+TikTok';
  };

  const flashSaleItems = query ? [] : products.filter(p => p.isFlashSale);
  const regularItems = query ? products : products.filter(p => !p.isFlashSale);

  return (
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800'>
      
      {/* 1. NAVBAR PREMIUM */}
      <nav className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Professional */}
            <div 
                onClick={handleReset} 
                className="flex items-center gap-2 cursor-pointer group"
            >
                <div className="bg-orange-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Icons.Logo />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-black tracking-tighter text-gray-900">
                        SHOX<span className="text-orange-600">PED</span>
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Price Tracker</span>
                </div>
            </div>

            {/* Tombol Reset (Muncul saat search) */}
            {query && (
                <button 
                    onClick={handleReset}
                    className="text-sm font-bold text-gray-500 hover:text-orange-600 transition"
                >
                    Kembali ke Home
                </button>
            )}
        </div>
      </nav>

      <div className='container mx-auto px-4 max-w-6xl pb-20'>
        
        {/* 2. HERO SECTION (BANNER TULISAN BESAR) */}
        {!query && (
            <div className="py-12 md:py-16 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2 border border-orange-200">
                    <Icons.Trending />
                    <span>Riset Data: Minggu Ini</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    Cek Harga Sebelum <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                        Checkout Keranjangmu.
                    </span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Platform #1 perbandingan harga otomatis. Kami melacak diskon tersembunyi di <strong className="text-orange-500">Shopee</strong> & <strong className="text-black">TikTok</strong> agar Anda selalu dapat harga termurah.
                </p>
            </div>
        )}

        {/* HEADER HASIL PENCARIAN */}
        {query && (
            <div className="mt-8 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className='text-2xl font-bold text-gray-800'>
                    Hasil Pencarian: <span className='text-orange-600 border-b-4 border-orange-200'>"{query}"</span>
                </h1>
                <p className='text-gray-500 mt-2 text-sm'>
                    Ditemukan <strong>{products.length}</strong> produk relevan.
                </p>
            </div>
        )}

        {/* 3. FLASH SALE SECTION */}
        {!query && flashSaleItems.length > 0 && (
          <div className='mb-16'>
            <div className='flex items-center justify-between mb-8'>
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-2 rounded-lg">
                         <Icons.Logo />
                    </div>
                    <div>
                        <h2 className='text-2xl font-black text-gray-900 uppercase tracking-tight'>Flash Sale</h2>
                        <p className="text-xs text-red-600 font-bold animate-pulse">Sedang Berlangsung • Berakhir Segera</p>
                    </div>
                </div>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {flashSaleItems.map((item) => (
                <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} handleImageError={handleImageError} />
              ))}
            </div>
          </div>
        )}

        {/* 4. REGULER ITEMS SECTION */}
        <div>
            {!query && regularItems.length > 0 && (
                <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
                     <h2 className='text-xl font-bold text-gray-900'>Rekomendasi Termurah</h2>
                     <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">Terlaris</span>
                </div>
            )}

            {regularItems.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {regularItems.map((item) => (
                        <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} handleImageError={handleImageError} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300'>
                    <div className='text-6xl mb-4 opacity-30'>🔍</div>
                    <h3 className='text-xl font-bold text-gray-800'>Produk Tidak Ditemukan</h3>
                    <p className='text-gray-500 mt-2 mb-8'>Coba kata kunci lain atau kembali ke halaman utama.</p>
                    <button onClick={handleReset} className='px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1'>
                        Kembali ke Home
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU PREMIUM ---
const ProductCardItem = ({ item, formatRupiah, handleImageError }: any) => {
    // Hitung selisih harga (Diskon cerdas)
    const cheapestPrice = Math.min(item.shopeePrice, item.tiktokPrice);
    const isShopeeCheaper = item.shopeePrice <= item.tiktokPrice;

    return (
        <div className='group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative'>
            
            {/* Badge Hemat (Opsional) */}
            <div className="absolute top-3 left-3 z-10">
                <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/20">
                    Terjual {item.sold}+
                </div>
            </div>

            {/* Gambar */}
            <div className='relative h-64 w-full bg-gray-100 overflow-hidden'>
                <img 
                    src={item.image} 
                    alt={item.title} 
                    onError={handleImageError}
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700'
                />
                
                {/* Overlay Gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60'></div>
                
                <div className='absolute bottom-3 left-3 right-3 text-white'>
                     <div className="flex items-center gap-1 text-xs font-medium text-yellow-300 mb-1">
                        <Icons.Star /> {item.rating}
                     </div>
                     <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0,2).map((t: string) => (
                            <span key={t} className='text-[9px] uppercase font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white tracking-wider'>
                                {t}
                            </span>
                        ))}
                     </div>
                </div>
            </div>

            {/* Konten */}
            <div className='p-5 flex flex-col flex-grow'>
                <h3 className='font-bold text-gray-900 text-base mb-4 leading-snug line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors'>
                    {item.title}
                </h3>
                
                {/* Perbandingan Harga */}
                <div className='mt-auto space-y-2 mb-4'>
                    {/* Shopee Row */}
                    <div className={`flex justify-between items-center p-2 rounded-lg ${isShopeeCheaper ? 'bg-orange-50 border border-orange-100' : 'bg-transparent'}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Shopee</span>
                            {isShopeeCheaper && <span className="text-[9px] bg-orange-200 text-orange-800 px-1 rounded font-bold">TERMURAH</span>}
                        </div>
                        <span className={`text-sm font-bold ${isShopeeCheaper ? 'text-orange-600' : 'text-gray-400'}`}>
                            {formatRupiah(item.shopeePrice)}
                        </span>
                    </div>

                    {/* TikTok Row */}
                    <div className={`flex justify-between items-center p-2 rounded-lg ${!isShopeeCheaper ? 'bg-gray-100 border border-gray-200' : 'bg-transparent'}`}>
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">TikTok</span>
                             {!isShopeeCheaper && <span className="text-[9px] bg-gray-300 text-gray-800 px-1 rounded font-bold">TERMURAH</span>}
                        </div>
                        <span className={`text-sm font-bold ${!isShopeeCheaper ? 'text-black' : 'text-gray-400'}`}>
                            {formatRupiah(item.tiktokPrice)}
                        </span>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className='grid grid-cols-2 gap-3'>
                    <a 
                        href={item.shopeeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-orange-200 text-center flex items-center justify-center gap-1 no-underline group/btn'
                    >
                    Beli Shopee 
                    <span className="group-hover/btn:translate-x-1 transition-transform">&gt;</span>
                    </a>
                    
                    <a 
                        href={item.tiktokLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-gray-300 text-center flex items-center justify-center gap-1 no-underline group/btn'
                    >
                    Beli TikTok 
                    <span className="group-hover/btn:translate-x-1 transition-transform">&gt;</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductList;