import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  const formatRupiah = (num: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Tampilan kalau Kosong
  if (wishlist.length === 0) {
    return (
      <div className="pt-24 px-4 min-h-screen bg-gray-50 text-center flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 grayscale opacity-50">❤️</div>
        <h2 className="font-bold text-xl text-gray-800">Wishlist Masih Kosong</h2>
        <p className="text-gray-500 mt-2 text-sm">Belum ada barang impian yang disimpan.</p>
        <Link to="/" className="mt-6 bg-[#ee4d2d] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-orange-600 transition">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // Tampilan kalau Ada Isinya (Grid Produk)
  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-4">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>💖</span> Wishlist Kamu <span className="text-gray-400 text-sm font-normal">({wishlist.length} barang)</span>
            </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative group">
                
                {/* Gambar */}
                <div className="relative aspect-square bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    
                    {/* Tombol Hapus (Sampah) */}
                    <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition z-10"
                        title="Hapus"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-3.458-.425m-3.458.425a49.471 49.471 0 0 0-3.458.425v-.113c0-.794.61-1.428 1.364-1.452Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* Info Produk */}
                <div className="p-3 flex flex-col flex-grow justify-between">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2 leading-relaxed">{item.title}</h3>
                    <div>
                        <div className="flex justify-between items-center text-xs mb-3">
                            <span className="text-[#ee4d2d] font-bold">{formatRupiah(item.shopeePrice)}</span>
                        </div>
                        <div className="flex gap-2">
                            <a href={item.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-orange-50 text-[#ee4d2d] border border-[#ee4d2d] text-[10px] py-2 rounded text-center font-bold hover:bg-[#ee4d2d] hover:text-white transition">
                                Shopee
                            </a>
                            <a href={item.finalTikTokLink} target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 text-gray-800 border border-gray-300 text-[10px] py-2 rounded text-center font-bold hover:bg-black hover:text-white hover:border-black transition">
                                TikTok
                            </a>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}