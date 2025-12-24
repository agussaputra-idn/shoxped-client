import React from 'react';

// Definisi Tipe Data agar aman (TypeScript)
interface ProductData {
  id?: number;
  title: string;
  shopeePrice: number;
  tiktokPrice: number;
  image: string;
  location?: string;
  rating?: number;
  sold?: number;
  isFlashSale?: boolean;
  tags?: string[];
}

interface ProductProps {
  product: ProductData;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  // Helper: Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Logic: Hitung selisih harga (siapa lebih murah?)
  const diff = product.shopeePrice - product.tiktokPrice;
  const isShopeeCheaper = diff < 0;

  return (
    <div className='bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full'>
      
      {/* --- BAGIAN GAMBAR --- */}
      <div className='relative h-64 w-full bg-gray-100 group overflow-hidden'>
        <img
          src={product.image}
          alt={product.title}
          className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
        />
        
        {/* Badge Flash Sale */}
        {product.isFlashSale && (
          <div className='absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10'>
            Flash Sale
          </div>
        )}

        {/* Lokasi (Overlay Bawah) */}
        {product.location && (
          <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3'>
            <span className='text-white text-xs font-medium flex items-center'>
              📍 {product.location}
            </span>
          </div>
        )}
      </div>

      {/* --- BAGIAN KONTEN --- */}
      <div className='p-4 flex flex-col flex-grow'>
        
        {/* Tags Kategori */}
        {product.tags && product.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-2'>
            {product.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className='text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Judul Produk */}
        <h3 className='font-bold text-gray-800 text-base mb-2 leading-snug line-clamp-2 min-h-[2.5rem]'>
          {product.title}
        </h3>

        {/* Rating & Terjual */}
        <div className='flex items-center text-xs text-gray-500 mb-4 font-medium'>
          <span className='text-yellow-400 text-sm mr-1'>★</span> 
          {product.rating || '5.0'} 
          <span className='mx-2 text-gray-300'>|</span> 
          Terjual {product.sold || '100+'}
        </div>

        {/* Komparasi Harga (Inti Fitur) */}
        <div className='mt-auto bg-gray-50 rounded-lg p-3 border border-gray-200'>
          {/* Baris Shopee */}
          <div className='flex justify-between items-center mb-2 pb-2 border-b border-gray-200 border-dashed'>
            <div className='flex items-center'>
               <span className='text-xs font-bold text-orange-500 uppercase mr-2'>Shopee</span>
               {isShopeeCheaper && <span className='text-[8px] bg-green-100 text-green-700 px-1 rounded font-bold'>HEMAT</span>}
            </div>
            <span className={`text-sm font-bold ${isShopeeCheaper ? 'text-green-600' : 'text-gray-700'}`}>
              {formatRupiah(product.shopeePrice)}
            </span>
          </div>

          {/* Baris TikTok */}
          <div className='flex justify-between items-center'>
             <div className='flex items-center'>
               <span className='text-xs font-bold text-black uppercase mr-2'>TikTok</span>
               {!isShopeeCheaper && <span className='text-[8px] bg-green-100 text-green-700 px-1 rounded font-bold'>HEMAT</span>}
            </div>
            <span className={`text-sm font-bold ${!isShopeeCheaper ? 'text-green-600' : 'text-gray-700'}`}>
              {formatRupiah(product.tiktokPrice)}
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className='grid grid-cols-2 gap-2 mt-3'>
          <button className='bg-orange-500 hover:bg-orange-600 text-white py-2 rounded text-xs font-bold transition-colors'>
            Ke Shopee
          </button>
          <button className='bg-gray-900 hover:bg-black text-white py-2 rounded text-xs font-bold transition-colors'>
            Ke TikTok
          </button>
        </div>

      </div>
    </div>
  );
};

export default Product;