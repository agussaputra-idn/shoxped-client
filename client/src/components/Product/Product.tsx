import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// =========================================
// DATA MOCKUP PREMIUM (REALISTIS)
// =========================================
const REALISTIC_PRODUCTS = [
  {
    id: 1,
    title: 'Apple MacBook Air M2 Chip 2023 - Midnight',
    shopeePrice: 18999000,
    tiktokPrice: 19100000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Pusat',
    rating: 4.9,
    sold: 1200,
    tags: ['Garansi Resmi', 'Cashback 5%', 'Laptop', 'Apple'],
    isFlashSale: true
  },
  {
    id: 2,
    title: "Sepatu Sneakers Nike Air Force 1 '07 - White",
    shopeePrice: 1549000,
    tiktokPrice: 1499000,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80',
    location: 'Tangerang Selatan',
    rating: 4.8,
    sold: 540,
    tags: ['Original', 'Gratis Ongkir', 'Sepatu', 'Fashion'],
    isFlashSale: true
  },
  {
    id: 3,
    title: 'SKINTIFIC 5X Ceramide Barrier Repair Moisturizer Gel 30g',
    shopeePrice: 139000,
    tiktokPrice: 135000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    location: 'Surabaya',
    rating: 5.0,
    sold: 15000,
    tags: ['BPOM', 'Termurah', 'Skincare', 'Kecantikan'],
    isFlashSale: true
  },
  {
    id: 4,
    title: 'Kamera Mirrorless Sony Alpha a6400 Kit 16-50mm',
    shopeePrice: 12499000,
    tiktokPrice: 12350000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    location: 'Jakarta Utara',
    rating: 4.9,
    sold: 230,
    tags: ['Cicilan 0%', 'Kamera', 'Elektronik'],
    isFlashSale: false
  },
  {
    id: 5,
    title: 'Tas Ransel Pria Waterproof Anti Air Premium Backpack',
    shopeePrice: 185000,
    tiktokPrice: 195000,
    image: 'https://images.unsplash.com/photo-1622560480654-d9621481884e?auto=format&fit=crop&w=800&q=80',
    location: 'Bandung',
    rating: 4.7,
    sold: 2100,
    tags: ['Lokal Pride', 'Tas', 'Fashion'],
    isFlashSale: false
  },
  {
    id: 6,
    title: 'Smartwatch Apple Watch Series 9 GPS 41mm Aluminum Case',
    shopeePrice: 6999000,
    tiktokPrice: 6850000,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    location: 'Medan',
    rating: 4.9,
    sold: 89,
    tags: ['Garansi IBOX', 'Jam Tangan', 'Gadget'],
    isFlashSale: false
  }
];

// =========================================
// KOMPONEN UTAMA
// =========================================
const ProductList = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('name') || ''; // Ambil kata kunci dari URL
  const [products, setProducts] = useState(REALISTIC_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // LOGIKA PENCARIAN & FILTERING
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        
        // Filter produk: Judul mengandung query ATAU Tags mengandung query
        const filteredData = REALISTIC_PRODUCTS.filter((product) =>
          product.title.toLowerCase().includes(lowerCaseQuery) || 
          product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
        
        setProducts(filteredData);
      } else {
        // Jika tidak ada pencarian, tampilkan semua
        setProducts(REALISTIC_PRODUCTS);
      }
      
      setLoading(false);
    }, 800); // Simulasi delay loading agar terasa nyata

    return () => clearTimeout(timer);
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDifference = (price1: number, price2: number) => {
    const diff = price1 - price2;
    if (diff === 0) return 'Harga Sama';
    if (diff < 0) return `Shopee lebih murah ${formatPrice(Math.abs(diff))}`;
    return `TikTok lebih murah ${formatPrice(diff)}`;
  };

  return (
    <div className='bg-gray-50 min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        {/* Header Hasil Pencarian */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
            {query ? `Hasil Pencarian untuk "${query}"` : 'Semua Produk'}
          </h1>
          <p className='text-gray-600 mt-2'>
            {products.length > 0 
              ? `Menampilkan ${products.length} produk terbaik dari Shopee & TikTok Shop`
              : `Tidak ditemukan produk untuk kata kunci "${query}"`
            }
          </p>
        </div>

        {loading ? (
          // Tampilan Loading
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          </div>
        ) : (
          <>
            {/* Jika Produk Ditemukan */}
            {products.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    formatPrice={formatPrice} 
                    calculateDifference={calculateDifference} 
                    isFlashSale={product.isFlashSale} 
                  />
                ))}
              </div>
            ) : (
              // Jika Produk KOSONG (Tidak ketemu)
              <div className='text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100'>
                <div className='text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-bold text-gray-800 mb-2'>Produk Tidak Ditemukan</h3>
                <p className='text-gray-500'>
                  Maaf, kami tidak menemukan produk dengan kata kunci "{query}".<br/>
                  Coba cari "Laptop", "Sepatu", atau "Skincare".
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// KOMPONEN KARTU PRODUK
const ProductCard = ({ product, formatPrice, calculateDifference, isFlashSale = false }) => {
    const shopeeIsCheaper = product.shopeePrice < product.tiktokPrice;
    
    return (
        <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${isFlashSale ? 'border-red-200 relative' : 'border-gray-100'}`}>
            {isFlashSale && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                    Flash Sale
                </div>
            )}

            <div className='relative h-56 overflow-hidden group'>
                <img
                    src={product.image}
                    alt={product.title}
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {product.location}
                </div>
            </div>

            <div className='p-5'>
                <div className='flex flex-wrap gap-1 mb-2'>
                    {product.tags.map((tag, index) => (
                        <span key={index} className='text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>{tag}</span>
                    ))}
                </div>

                <h3 className='font-bold text-gray-800 text-lg mb-2 line-clamp-2 min-h-[3.5rem]'>
                    {product.title}
                </h3>

                 <div className='flex items-center text-sm text-gray-500 mb-4'>
                    <div className='flex items-center text-yellow-400 mr-2'>
                        <span>⭐</span>
                        <span className='font-semibold ml-1 text-gray-700'>{product.rating}</span>
                    </div>
                    <span>| Terjual {product.sold}+</span>
                </div>

                <div className='bg-gray-50 p-3 rounded-lg mb-4'>
                    <div className='grid grid-cols-2 gap-4 relative'>
                        <div className='absolute inset-y-0 left-1/2 w-px bg-gray-200'></div>
                        <div className='relative pr-2'>
                            <div className='flex items-center mb-1'>
                                <span className='text-xs font-semibold text-primary mr-1'>Shopee</span>
                                {shopeeIsCheaper && <span className='text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold'>Termurah</span>}
                            </div>
                            <div className={`font-bold ${shopeeIsCheaper ? 'text-green-600 text-lg' : 'text-gray-700'}`}>
                                {formatPrice(product.shopeePrice)}
                            </div>
                        </div>

                        <div className='relative pl-2'>
                             <div className='flex items-center mb-1'>
                                <span className='text-xs font-semibold text-black mr-1'>TikTok</span>
                                {!shopeeIsCheaper && <span className='text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold'>Termurah</span>}
                            </div>
                            <div className={`font-bold ${!shopeeIsCheaper ? 'text-green-600 text-lg' : 'text-gray-700'}`}>
                                {formatPrice(product.tiktokPrice)}
                            </div>
                        </div>
                    </div>
                    <div className='text-center text-xs font-medium text-blue-600 mt-2 pt-2 border-t border-gray-100'>
                        {calculateDifference(product.shopeePrice, product.tiktokPrice)}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                    <a href="#" className='flex-1 bg-primary text-white text-center py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors'>
                        Beli di Shopee
                    </a>
                    <a href="#" className='flex-1 bg-black text-white text-center py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors'>
                        Beli di TikTok
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProductList;