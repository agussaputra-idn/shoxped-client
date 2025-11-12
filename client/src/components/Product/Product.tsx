import { Link } from 'react-router-dom';
import { formatCurrency } from 'src/utils/helper';
// Import ikon lokasi dari Heroicons
import { MapPinIcon } from '@heroicons/react/24/outline'; 

// Definisikan tipe (props) yang akan diterima komponen ini
interface Props {
  product: {
    store: string;
    image: string;
    name: string;
    rating: number;
    sold: number;
    price: number;
    price_before_discount: number;
    promo: string;
    promoLabel?: string; 
    location: string; 
    dealText: string;
  };
}

// Komponen Bintang Rating (mini) - Tidak berubah
function StarRating({ rating }: { rating: number }) {
  const maxRating = 5;
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const emptyStars = maxRating - filledStars - (halfStar ? 1 : 0);

  return (
    <div className='flex items-center'>
      {[...Array(filledStars)].map((_, i) => (
        <svg key={`full-${i}`} className='h-3 w-3 fill-yellow-400' viewBox='0 0 20 20'><path d='M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z' /></svg>
      ))}
      {/* ... sisa kode bintang ... */}
    </div>
  );
}

// Ini adalah Komponen Kartu Produk Anda
export default function Product({ product }: Props) {
  const isShopee = product.store === 'Shopee';
  const storeColor = isShopee ? 'bg-primary' : 'bg-black'; 
  const storeTextColor = isShopee ? 'text-primary' : 'text-black'; 

  return (
    <div className='flex h-full flex-col rounded-sm border bg-white shadow-sm transition-transform duration-100 hover:shadow-md'>
      {/* Link ke halaman (masih dummy) */}
      <Link to='/' className='relative w-full pt-[100%]'> 
        {/* Gambar Produk */}
        <img
          src={product.image}
          alt={product.name}
          className='absolute top-0 left-0 h-full w-full rounded-t-sm object-cover'
        />
        
        {/* === PERBAIKAN: Label Promo Horizontal (Tidak Terpotong) === */}
        {product.promoLabel && (
          <div className='absolute top-2 right-2 rounded-sm bg-yellow-400 px-1.5 py-0.5 text-xs font-semibold text-gray-800'>
            {product.promoLabel}
          </div>
        )}
        {/* ======================================================= */}

      </Link>
      
      {/* Konten Teks */}
      <div className='flex flex-1 flex-col p-3'>
        <p className='text-xs font-semibold uppercase'>{product.store}</p>
        
        <p className='mt-2 min-h-[40px] text-sm font-medium line-clamp-2'>{product.name}</p>

        {/* Rating & Terjual */}
        <div className='mt-2 flex items-center gap-2 text-xs text-gray-500'>
          <StarRating rating={product.rating} />
          <span>|</span>
          <span className='line-clamp-1'>{product.sold.toLocaleString()} Terjual</span>
        </div>

        {/* Harga */}
        <div className='mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1'>
          <span className={`text-lg font-semibold ${storeTextColor}`}>
            Rp{formatCurrency(product.price)}
          </span>
          {product.price_before_discount > 0 && (
            <span className='text-xs text-gray-400 line-through'>
              Rp{formatCurrency(product.price_before_discount)}
            </span>
          )}
        </div>

        {/* Ikon Lokasi */}
        <div className='mt-2 flex items-center text-xs text-gray-600'> 
          <MapPinIcon className='mr-1 h-3.5 w-3.5 text-gray-500' /> 
          <span className='line-clamp-1'>{product.location}</span> 
        </div>
        
        {/* Spacer */}
        <div className='flex-grow' /> 

        {/* Tombol Aksi (Button) */}
        <button
          className={`mt-4 w-full rounded-sm py-2 px-4 text-sm font-medium text-white ${storeColor} hover:opacity-90`}
        >
          {product.dealText}
        </button>
      </div>
    </div>
  );
}