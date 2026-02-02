import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PriceDropToastProps {
  product: any;
  onClose: () => void;
}

const PriceDropToast = ({ product, onClose }: PriceDropToastProps) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animasi Muncul
    setTimeout(() => setVisible(true), 100);
    
    // Hilang otomatis setelah 8 detik
    const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); 
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleCheck = () => {
    navigate('/wishlist');
    onClose();
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  // Hitung hematnya berapa
  const oldPrice = product.originalPrice || product.oldPrice || 0;
  const currentPrice = product.price || product.newPrice || 0;
  const savedAmount = oldPrice - currentPrice;

  return (
    <div className={`fixed bottom-20 left-4 right-4 md:bottom-10 md:right-10 md:left-auto md:w-96 z-[999] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-[#ee4d2d] p-4 flex gap-3 items-start relative overflow-hidden">
        
        {/* Hiasan Background */}
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-red-100 rounded-full opacity-50 blur-xl"></div>

        {/* Gambar Produk */}
        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img src={product.image} alt="Product" className="w-full h-full object-cover" />
        </div>

        {/* Teks */}
        <div className="flex-1 min-w-0">
            <h4 className="text-[#ee4d2d] font-bold text-sm uppercase flex items-center gap-1">
                <span>📉</span> Turun Harga!
            </h4>
            <p className="text-gray-800 text-xs md:text-sm font-medium line-clamp-1 mt-0.5">
                {product.title || product.name}
            </p>
            <div className="text-xs mt-1 text-gray-500">
                Hemat <span className="font-bold text-green-600">Rp{formatRupiah(savedAmount)}</span> hari ini!
            </div>
        </div>

        {/* Tombol */}
        <div className="flex flex-col gap-2">
            <button onClick={handleCheck} className="bg-[#ee4d2d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-orange-600 transition active:scale-95">
                Cek
            </button>
            <button onClick={() => setVisible(false)} className="text-gray-300 hover:text-gray-500 text-[10px] underline">
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

export default PriceDropToast;