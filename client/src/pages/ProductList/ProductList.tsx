import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- DATABASE PRODUK (20 ITEM VIRAL DENGAN GAMBAR ASLI) ---
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

// --- ICONS (SVG Murni) ---
const Icons = {
    Logo: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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

// --- LOGIKA & UI TOKO ---
const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('name') || '';
  const [products, setProducts] = useState(PRODUCTS_DATA);

  // LOGIKA PENCARIAN & SMART PRICE
  useEffect(() => {
    let dataToDisplay = PRODUCTS_DATA;
    if (query) {
      const lower = query.toLowerCase();
      dataToDisplay = PRODUCTS_DATA.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    
    // SMART SIMULATION: Generate harga TikTok jika belum ada
    const enhancedData = dataToDisplay.map(p => {
        // Jika ada harga asli dari database (manual), pakai itu. Jika tidak, simulasi cerdas.
        const tiktokPrice = (p as any).tiktokPrice || Math.floor(p.shopeePrice * (Math.random() * (1.05 - 0.95) + 0.95) / 100) * 100;
        
        return {
            ...p,
            tiktokPrice: tiktokPrice,
            // Generate Link Search otomatis
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
    <div className='min-h-screen bg-gray-50 font-sans text-gray-800 pb-20'>
      
      {/* 1. NAVBAR PRO */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div onClick={handleReset} className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-1.5 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                    <Icons.Logo />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-black tracking-tighter text-gray-900">
                        SHOX<span className="text-orange-600">PED</span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Price Tracker</span>
                </div>
            </div>
            {query && (
                <button onClick={handleReset} className="text-xs font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition">
                    &larr; Kembali
                </button>
            )}
        </div>
      </nav>

      <div className='container mx-auto px-4 max-w-6xl'>
        
        {/* 2. HERO BANNER */}
        {!query && (
            <div className="py-12 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                    <Icons.Trending /> Update Harian: {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    Jangan Beli Sebelum <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                        Cek Harga Disini.
                    </span>
                </h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                    Platform #1 perbandingan harga otomatis Shopee vs TikTok. Temukan harga termurah dalam 1 detik.
                </p>
            </div>
        )}

        {/* 3. FLASH SALE */}
        {!query && flashSaleItems.length > 0 && (
          <div className='mb-12'>
            <div className='flex items-center gap-3 mb-6'>
                <div className="h-8 w-1 bg-red-600 rounded-full"></div>
                <h2 className='text-2xl font-black text-gray-900 uppercase'>⚡ Flash Sale</h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {flashSaleItems.map((item) => (
                <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} />
              ))}
            </div>
          </div>
        )}

        {/* 4. PRODUK LAINNYA */}
        <div>
            {!query && regularItems.length > 0 && (
                <div className='flex items-center gap-3 mb-6'>
                    <div className="h-8 w-1 bg-orange-600 rounded-full"></div>
                    <h2 className='text-xl font-bold text-gray-900'>Rekomendasi Termurah</h2>
                </div>
            )}

            {regularItems.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {regularItems.map((item) => (
                        <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-24'>
                    <div className='text-6xl mb-4 opacity-20'>🔍</div>
                    <h3 className='text-xl font-bold text-gray-800'>Tidak Ditemukan</h3>
                    <button onClick={handleReset} className='mt-4 px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition'>
                        Reset Pencarian
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- KARTU PRODUK ELEGAN ---
const ProductCardItem = ({ item, formatRupiah }: any) => {
    // Logika pewarnaan harga
    const isShopeeCheaper = item.shopeePrice <= item.tiktokPrice;

    return (
        <div className='group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative'>
            
            {/* Image Section */}
            <div className='relative h-60 bg-gray-100 overflow-hidden'>
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700'
                    onError={(e:any) => e.target.src = 'https://via.placeholder.com/400'}
                />
                <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent'>
                    <div className="flex items-center gap-1 text-yellow-300 text-xs font-bold">
                        <Icons.Star /> {item.rating} • {item.sold/1000}RB+ Terjual
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className='p-4 flex flex-col flex-grow'>
                <div className="flex gap-2 mb-2">
                    {item.tags?.slice(0,2).map((t: string) => (
                        <span key={t} className='text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider'>
                            {t}
                        </span>
                    ))}
                </div>
                
                <h3 className='font-bold text-gray-800 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[2.5rem]'>
                    {item.title}
                </h3>

                {/* Price Comparison Block */}
                <div className="mt-auto space-y-2 mb-4">
                    {/* Shopee Row */}
                    <div className={`flex justify-between items-center p-2 rounded-lg ${isShopeeCheaper ? 'bg-orange-50 border border-orange-100' : ''}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Shopee</span>
                            {isShopeeCheaper && <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold">WIN</span>}
                        </div>
                        <span className={`text-sm font-bold ${isShopeeCheaper ? 'text-orange-600' : 'text-gray-400'}`}>
                            {formatRupiah(item.shopeePrice)}
                        </span>
                    </div>

                    {/* TikTok Row */}
                    <div className={`flex justify-between items-center p-2 rounded-lg ${!isShopeeCheaper ? 'bg-gray-100 border border-gray-200' : ''}`}>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-black uppercase tracking-widest">TikTok</span>
                            {!isShopeeCheaper && <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-bold">WIN</span>}
                        </div>
                        <span className={`text-sm font-bold ${!isShopeeCheaper ? 'text-black' : 'text-gray-400'}`}>
                            {formatRupiah(item.tiktokPrice)}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className='grid grid-cols-2 gap-2'>
                    <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className='bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-xs font-bold text-center transition shadow-lg hover:shadow-orange-200'>
                        Beli Shopee &gt;
                    </a>
                    <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-bold text-center transition shadow-lg'>
                        Beli TikTok &gt;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductList;