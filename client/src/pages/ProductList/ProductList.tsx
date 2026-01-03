import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- DATABASE PRODUK VIRAL (DATA LENGKAP) ---
const PRODUCTS_DATA = [
  // =========================================
  // FLASH SALE (4 ITEM TERLARIS)
  // =========================================
  {
    id: 100,
    title: "INSPIRED Scarlett Whitening PARFUM Unisex Memories Dreamy 30ml",
    shopeePrice: 9000,
    tiktokPrice: 9500,
    image: "https://placehold.co/600x600/orange/white?text=Scarlett+Parfum+Viral",
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
    image: "https://placehold.co/600x600/orange/white?text=Rak+Troli+Viral",
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
    image: "https://placehold.co/600x600/orange/white?text=Pewarna+Rambut+Stick",
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
    image: "https://placehold.co/600x600/orange/white?text=Timbangan+Digital",
    location: "Jakarta",
    rating: 4.9,
    sold: 10000,
    tags: ["Elektronik", "Pasar"],
    isFlashSale: true,
    shopeeLink: "https://s.shopee.co.id/5q1diV9GuY",
    tiktokLink: "https://www.tiktok.com/search?q=Timbangan%20Digital%2040kg"
  },

  // =========================================
  // PRODUK REGULER (TERLARIS LAINNYA)
  // =========================================
  {
    id: 187,
    title: "Kipas Angin Mini Portable Turbo (Tahan 24 Jam)",
    shopeePrice: 33000,
    tiktokPrice: 35000,
    image: "https://placehold.co/600x600/gray/white?text=Kipas+Portable",
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
    image: "https://placehold.co/600x600/gray/white?text=Khimar+Syari",
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
    image: "https://placehold.co/600x600/gray/white?text=Parfum+Pria",
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
    image: "https://placehold.co/600x600/gray/white?text=Parfum+Bali+Surfers",
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
    image: "https://placehold.co/600x600/gray/white?text=Kaftan+Tunik",
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
    image: "https://placehold.co/600x600/gray/white?text=Sandal+Baim+Pria",
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
    image: "https://placehold.co/600x600/gray/white?text=Oneset+Rayon",
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
    image: "https://placehold.co/600x600/gray/white?text=Detergen+Sayang",
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
    image: "https://placehold.co/600x600/gray/white?text=Lunch+Box+Ecentio",
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
    image: "https://placehold.co/600x600/gray/white?text=Tumbler+Stainless",
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
    image: "https://placehold.co/600x600/gray/white?text=Sweatpants+Wanita",
    location: "Bandung",
    rating: 4.8,
    sold: 10000,
    tags: ["Fashion", "Celana"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/8V2OtOz7Tn",
    tiktokLink: "https://www.tiktok.com/search?q=Amicaa%20Sweatpants"
  },
  {
    id: 148,
    title: "WANNAFIT Pulley Cable System Set Alat Gym Rumahan",
    shopeePrice: 190000,
    tiktokPrice: 200000,
    image: "https://placehold.co/600x600/gray/white?text=Alat+Gym+Rumah",
    location: "Jakarta",
    rating: 4.9,
    sold: 8000,
    tags: ["Olahraga", "Gym"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/1gC4kqP8M6",
    tiktokLink: "https://www.tiktok.com/search?q=Pulley%20Cable%20System"
  },
  {
    id: 118,
    title: "SOMBONG 5-in-1 Sunscreen Spray SPF 30",
    shopeePrice: 78000,
    tiktokPrice: 85000,
    image: "https://placehold.co/600x600/gray/white?text=Sunscreen+Spray",
    location: "Jakarta",
    rating: 4.7,
    sold: 8000,
    tags: ["Skincare", "Viral"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/7KqRVG3Yqi",
    tiktokLink: "https://www.tiktok.com/search?q=SOMBONG%20Sunscreen"
  },
  {
    id: 139,
    title: "Biji Kopi Pure Arabica 500 Gram Commercial Grade",
    shopeePrice: 99300,
    tiktokPrice: 105000,
    image: "https://placehold.co/600x600/gray/white?text=Kopi+Arabica",
    location: "Aceh",
    rating: 4.9,
    sold: 7000,
    tags: ["Makanan", "Kopi"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/2qO28zKgzB",
    tiktokLink: "https://www.tiktok.com/search?q=Biji%20Kopi%20Arabica"
  },
  {
    id: 143,
    title: "Aeiso Sepatu Sport Casual Fashionable (Kerja & Jalan)",
    shopeePrice: 369800,
    tiktokPrice: 380000,
    image: "https://placehold.co/600x600/gray/white?text=Sepatu+Sport",
    location: "Tangerang",
    rating: 4.8,
    sold: 6000,
    tags: ["Sepatu", "Sport"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3VdiwDI9dN",
    tiktokLink: "https://www.tiktok.com/search?q=Sepatu%20Aeiso"
  },
  {
    id: 141,
    title: "Velixir Demeter Eau de Parfum for Unisex",
    shopeePrice: 195000,
    tiktokPrice: 200000,
    image: "https://placehold.co/600x600/gray/white?text=Parfum+Velixir",
    location: "Jakarta",
    rating: 4.9,
    sold: 5000,
    tags: ["Parfum", "Unisex"],
    isFlashSale: false,
    shopeeLink: "https://s.shopee.co.id/3B0sXbJQJH",
    tiktokLink: "https://www.tiktok.com/search?q=Velixir%20Demeter"
  }
];

// --- MESIN LOGIKA TOKO (JANGAN DIHAPUS) ---
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
    navigate('/search');
  };

  const handleImageError = (e: any) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=Produk+Shopee+TikTok';
  };

  const flashSaleItems = query ? [] : products.filter(p => p.isFlashSale);
  const regularItems = query ? products : products.filter(p => !p.isFlashSale);

  return (
    <div className='min-h-screen bg-gray-50 py-10 font-sans'>
      <div className='container mx-auto px-4 max-w-6xl'>
        
        {/* HEADER */}
        <div className='mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 uppercase tracking-wide'>
              {query ? (
                <>Hasil Pencarian: <span className='text-orange-500'>"{query}"</span></>
              ) : (
                'Katalog Produk Termurah'
              )}
            </h1>
            <p className='text-gray-500 mt-1 text-sm'>
              Total <strong>{products.length}</strong> produk tersedia.
            </p>
          </div>
          {query && (
            <button 
              onClick={handleReset}
              className='px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-full hover:bg-gray-900 transition shadow-lg'
            >
              ↻ Lihat Semua Produk
            </button>
          )}
        </div>

        {/* FLASH SALE */}
        {!query && flashSaleItems.length > 0 && (
          <div className='mb-12'>
            <div className='flex items-center gap-2 mb-6'>
                <h2 className='text-2xl font-black text-gray-800 uppercase'>⚡ FLASH SALE</h2>
                <span className='bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded animate-pulse'>Berakhir Segera</span>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {flashSaleItems.map((item) => (
                <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} handleImageError={handleImageError} />
              ))}
            </div>
          </div>
        )}

        {/* REGULER */}
        <div>
            {!query && regularItems.length > 0 && (
                 <h2 className='text-xl font-bold text-gray-800 uppercase mb-6 border-l-4 border-orange-500 pl-3'>
                    Produk Pilihan Lainnya
                 </h2>
            )}

            {regularItems.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {regularItems.map((item) => (
                        <ProductCardItem key={item.id} item={item} formatRupiah={formatRupiah} handleImageError={handleImageError} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-20'>
                    <div className='text-6xl mb-4'>🔍</div>
                    <h3 className='text-xl font-bold text-gray-800'>Tidak Ditemukan</h3>
                    <p className='text-gray-500 mt-2 mb-6'>Produk "{query}" tidak tersedia.</p>
                    <button onClick={handleReset} className='px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600'>
                    Lihat Semua Produk
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU ---
const ProductCardItem = ({ item, formatRupiah, handleImageError }: any) => {
    return (
        <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full'>
            {/* Gambar */}
            <div className='relative h-64 w-full bg-gray-200 overflow-hidden group'>
                <img 
                    src={item.image} 
                    alt={item.title} 
                    onError={handleImageError}
                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                />
                {item.isFlashSale && (
                    <div className='absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-wider'>
                        Flash Sale
                    </div>
                )}
                <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3'>
                    <span className='text-white text-xs font-medium flex items-center'>
                    📍 {item.location || 'Jakarta'}
                    </span>
                </div>
            </div>

            {/* Konten */}
            <div className='p-4 flex flex-col flex-grow'>
                <div className='flex flex-wrap gap-2 mb-2'>
                    {item.tags?.map((t: string) => (
                    <span key={t} className='text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md tracking-wide'>
                        {t}
                    </span>
                    ))}
                </div>

                <h3 className='font-bold text-gray-800 text-base mb-2 leading-snug line-clamp-2 min-h-[2.5rem]'>
                    {item.title}
                </h3>
                
                <div className='flex items-center text-xs text-gray-500 mb-4 font-medium'>
                    <span className='text-yellow-400 text-sm mr-1'>★</span> {item.rating || 4.5} | Terjual {item.sold || 10}+
                </div>

                <div className='mt-auto bg-gray-50 rounded-xl p-3 border border-gray-200'>
                    <div className='flex justify-between items-center mb-1 pb-1 border-b border-gray-200 border-dashed'>
                        <span className='text-xs font-bold text-orange-500 uppercase'>Shopee</span>
                        <span className='text-sm font-bold text-gray-700'>{formatRupiah(item.shopeePrice)}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-xs font-bold text-gray-800 uppercase'>TikTok</span>
                        <span className='text-sm font-bold text-gray-700'>{formatRupiah(item.tiktokPrice)}</span>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-2 mt-3 z-20 relative'>
                    <a 
                        href={item.shopeeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-orange-200 shadow-lg text-center flex items-center justify-center no-underline'
                    >
                    Beli Shopee &gt;
                    </a>
                    
                    <a 
                        href={item.tiktokLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-lg text-center flex items-center justify-center no-underline'
                    >
                    Beli TikTok &gt;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductList;