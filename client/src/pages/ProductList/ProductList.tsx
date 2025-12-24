import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- DATABASE PRODUK LENGKAP (12 Item) ---
const PRODUCTS_DATA = [
  // --- FLASH SALE ITEMS (Pastikan isFlashSale: true) ---
  {
    id: 1,
    title: 'ASUS ROG Strix G15 Gaming Laptop Ryzen 7',
    shopeePrice: 16500000,
    tiktokPrice: 16200000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Pusat',
    rating: 4.8,
    sold: 140,
    tags: ['Laptop', 'Gaming'],
    isFlashSale: true
  },
  {
    id: 3,
    title: 'Sepatu Nike Air Force 1 Triple White',
    shopeePrice: 1549000,
    tiktokPrice: 1499000,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Selatan',
    rating: 4.9,
    sold: 2300,
    tags: ['Sepatu', 'Fashion'],
    isFlashSale: true
  },
  {
    id: 5,
    title: 'SKINTIFIC 5X Ceramide Moisturizer',
    shopeePrice: 139000,
    tiktokPrice: 125000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    location: 'Surabaya',
    rating: 5.0,
    sold: 15000,
    tags: ['Skincare', 'Murah'],
    isFlashSale: true
  },
  {
    id: 7,
    title: 'Samsung Galaxy S24 Ultra 5G AI',
    shopeePrice: 21999000,
    tiktokPrice: 21500000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    location: 'Bekasi',
    rating: 4.8,
    sold: 450,
    tags: ['HP', 'Samsung'],
    isFlashSale: true
  },

  // --- REGULAR ITEMS ---
  {
    id: 2,
    title: 'MacBook Air M2 2023 Midnight 256GB',
    shopeePrice: 18999000,
    tiktokPrice: 19100000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    location: 'Tangerang',
    rating: 4.9,
    sold: 500,
    tags: ['Laptop', 'Apple'],
    isFlashSale: false
  },
  {
    id: 4,
    title: 'Adidas Ultraboost Light Running',
    shopeePrice: 2800000,
    tiktokPrice: 2850000,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee7c735df57?auto=format&fit=crop&w=800&q=80',
    location: 'Bandung',
    rating: 4.7,
    sold: 120,
    tags: ['Sepatu', 'Olahraga'],
    isFlashSale: false
  },
  {
    id: 6,
    title: 'iPhone 15 Pro Max 256GB Natural',
    shopeePrice: 23999000,
    tiktokPrice: 24200000,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Barat',
    rating: 4.9,
    sold: 1000,
    tags: ['HP', 'iPhone'],
    isFlashSale: false
  },
  {
    id: 8,
    title: 'Kemeja Flannel Uniqlo Kotak-Kotak',
    shopeePrice: 399000,
    tiktokPrice: 399000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Pusat',
    rating: 4.6,
    sold: 1200,
    tags: ['Baju', 'Fashion'],
    isFlashSale: false
  },
  {
    id: 9,
    title: 'Philips Air Fryer Low Watt 4.1L',
    shopeePrice: 1200000,
    tiktokPrice: 1150000,
    image: 'https://images.unsplash.com/photo-1585128993275-57d42e20551f?auto=format&fit=crop&w=800&q=80',
    location: 'Semarang',
    rating: 4.7,
    sold: 80,
    tags: ['Elektronik', 'Dapur'],
    isFlashSale: false
  },
  {
    id: 10,
    title: 'Jam Tangan Casio G-Shock GA-2100',
    shopeePrice: 1450000,
    tiktokPrice: 1500000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    location: 'Yogyakarta',
    rating: 4.9,
    sold: 600,
    tags: ['Jam', 'Aksesoris'],
    isFlashSale: false
  },
  {
    id: 11,
    title: 'Sunscreen Azarine Hydrasoothe Gel SPF45',
    shopeePrice: 65000,
    tiktokPrice: 59000,
    image: 'https://images.unsplash.com/photo-1556228720-1987df1c911e?auto=format&fit=crop&w=800&q=80',
    location: 'Medan',
    rating: 4.8,
    sold: 8500,
    tags: ['Skincare', 'Sunscreen'],
    isFlashSale: false
  },
  {
    id: 12,
    title: 'Tas Ransel Eiger Mountaineering 25L',
    shopeePrice: 450000,
    tiktokPrice: 425000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    location: 'Bandung',
    rating: 4.8,
    sold: 3000,
    tags: ['Tas', 'Outdoor'],
    isFlashSale: false
  }
];

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('name') || '';
  const [products, setProducts] = useState(PRODUCTS_DATA);

  // LOGIKA PENCARIAN
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

  // Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  // Reset
  const handleReset = () => {
    navigate('/search');
  };

  // Image Error
  const handleImageError = (e: any) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=Produk+Shopee+TikTok';
  };

  // MEMISAHKAN DATA (Flash Sale vs Regular)
  // Jika sedang mencari (query ada), kita gabung saja. Jika tidak, kita pisah.
  const flashSaleItems = query ? [] : products.filter(p => p.isFlashSale);
  const regularItems = query ? products : products.filter(p => !p.isFlashSale);

  return (
    <div className='min-h-screen bg-gray-50 py-10 font-sans'>
      <div className='container mx-auto px-4 max-w-6xl'>
        
        {/* === HEADER SEARCH INFO === */}
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

        {/* ================================================= */}
        {/* BAGIAN 1: FLASH SALE (Hanya muncul jika tidak mencari) */}
        {/* ================================================= */}
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

        {/* ================================================= */}
        {/* BAGIAN 2: PRODUK LAINNYA / HASIL PENCARIAN        */}
        {/* ================================================= */}
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
                // JIKA KOSONG (Saat mencari)
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

// --- SUB-COMPONENT UNTUK KARTU PRODUK (Supaya kode rapi) ---
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
                    📍 {item.location}
                    </span>
                </div>
            </div>

            {/* Konten */}
            <div className='p-4 flex flex-col flex-grow'>
                <div className='flex flex-wrap gap-2 mb-2'>
                    {item.tags.map((t: string) => (
                    <span key={t} className='text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md tracking-wide'>
                        {t}
                    </span>
                    ))}
                </div>

                <h3 className='font-bold text-gray-800 text-base mb-2 leading-snug line-clamp-2 min-h-[2.5rem]'>
                    {item.title}
                </h3>
                
                <div className='flex items-center text-xs text-gray-500 mb-4 font-medium'>
                    <span className='text-yellow-400 text-sm mr-1'>★</span> {item.rating} | Terjual {item.sold}+
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

                <div className='grid grid-cols-2 gap-2 mt-3'>
                    <button className='bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-orange-200 shadow-lg'>
                    Ke Shopee
                    </button>
                    <button className='bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-lg'>
                    Ke TikTok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;