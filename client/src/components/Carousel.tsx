import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChartPieIcon, ShoppingBagIcon, CurrencyDollarIcon, FireIcon } from '@heroicons/react/24/solid';

const Carousel = ({ featuredProducts }: { featuredProducts: any[] }) => {
  // --- 1. SETUP DATA (BANNER + 3 PRODUK RANDOM) ---
  const slides = useMemo(() => {
    const marketingBanners = [
      {
        id: 'banner-green',
        type: 'marketing',
        bgClass: 'bg-emerald-500', 
        badge: 'TIPS SULTAN',
        badgeColor: 'bg-yellow-400 text-black',
        title: 'RAHASIA CUAN',
        desc: 'Satu klik, hemat ribuan. Kenapa bayar lebih kalau barangnya sama?',
        btnText: 'Mulai Hemat ➔',
        icon: <ChartPieIcon className="w-32 h-32 text-black opacity-10 rotate-12" />
      },
      {
        id: 'banner-purple',
        type: 'marketing',
        bgClass: 'bg-violet-600', 
        badge: 'SMART BUYER',
        badgeColor: 'bg-yellow-300 text-black',
        title: 'SHOXPED DULU',
        desc: 'Jadikan ritual wajib sebelum checkout. Dompet aman, hatipun tenang.',
        btnText: 'Coba Shoxped ➔',
        icon: <ShoppingBagIcon className="w-32 h-32 text-white opacity-10 -rotate-12" />
      },
      {
        id: 'banner-red',
        type: 'marketing',
        bgClass: 'bg-gradient-to-r from-red-600 to-orange-600', 
        badge: 'AWAS BONCOS',
        badgeColor: 'bg-yellow-300 text-black',
        title: 'STOP ASAL BELI!',
        desc: 'Yakin harga di keranjangmu sudah paling murah? Cek dulu disini!',
        btnText: 'Buktikan Sekarang ➔',
        icon: <CurrencyDollarIcon className="w-32 h-32 text-black opacity-10" />
      }
    ];

    // Ambil 3 Produk Random
    const randomProducts = featuredProducts && featuredProducts.length > 0
      ? [...featuredProducts]
          .sort(() => 0.5 - Math.random()) // Acak posisi
          .slice(0, 3) // Ambil 3 items (Tadinya 2)
          .map(p => ({ ...p, type: 'product' }))
      : [];

    return [...marketingBanners, ...randomProducts];
  }, [featuredProducts]);

  // --- 2. LOGIC INFINITE LOOP (Berputar Tanpa Mundur) ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kita duplikasi slide pertama dan taruh di paling akhir (Clone)
  // Jadi urutannya: [1, 2, 3, 4, 5, 6, 1(Clone)]
  const extendedSlides = useMemo(() => {
    if (slides.length === 0) return [];
    return [...slides, slides[0]]; 
  }, [slides]);

  // Auto Slide
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length, currentIndex]); // Dependency updated

  const handleNext = () => {
    // Geser ke slide berikutnya
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  // Efek "Teleport" saat sampai di Clone
  useEffect(() => {
    // Jika kita sampai di slide terakhir (yang merupakan Clone dari slide 1)
    if (currentIndex === extendedSlides.length - 1) {
      // Tunggu animasi selesai (500ms), lalu teleport ke slide 0 asli tanpa animasi
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false); // Matikan animasi
        setCurrentIndex(0); // Pindah instan ke awal
      }, 500); // Sesuaikan dengan duration-500 di CSS
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, extendedSlides.length]);

  // Nyalakan kembali animasi setelah teleport
  useEffect(() => {
    if (currentIndex === 0 && !isTransitioning) {
      // Beri jeda sedikit agar React merender state "tanpa animasi" dulu
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [currentIndex, isTransitioning]);

  if (slides.length === 0) {
    return <div className="w-full h-40 bg-gray-100 rounded-xl animate-pulse"></div>;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-md group h-40 md:h-48 lg:h-52 bg-gray-50">
      
      {/* CONTAINER SLIDER */}
      <div 
        className={`flex h-full ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            
            {/* RENDER KONTEN */}
            {slide.type === 'marketing' ? (
              // === TAMPILAN MARKETING ===
              <div className={`w-full h-full ${slide.bgClass} flex flex-col justify-center px-6 md:px-10 relative overflow-hidden`}>
                <div className="absolute -right-4 -bottom-4 md:right-4 md:bottom-2 transform scale-125 md:scale-100 pointer-events-none">
                  {slide.icon}
                </div>
                <div className="mb-2 relative z-10">
                  <span className={`${slide.badgeColor} text-[10px] md:text-xs font-bold px-2 py-0.5 rounded shadow-sm`}>
                    ⚡ {slide.badge}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white italic tracking-tight mb-1 relative z-10">
                  {slide.title}
                </h2>
                <p className="text-white text-xs md:text-sm opacity-90 max-w-[75%] leading-snug mb-3 relative z-10">
                  {slide.desc}
                </p>
                <div className="relative z-10">
                  <button className="bg-white text-black text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full shadow hover:scale-105 transition flex items-center gap-1 active:scale-95">
                    {slide.btnText}
                  </button>
                </div>
              </div>

            ) : (
              // === TAMPILAN PRODUK PROMO ===
              <div className="w-full h-full bg-white flex items-center border border-gray-100 relative">
                 <div className="w-1/3 h-full bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden">
                    <img src={slide.image} alt="Produk" className="max-h-full max-w-full object-contain mix-blend-multiply z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/50 to-transparent"></div>
                 </div>
                 <div className="w-2/3 p-4 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                            <FireIcon className="w-3 h-3" /> VIRAL
                        </span>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{slide.title}</h3>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-[#ee4d2d] text-lg md:text-xl font-bold">Rp {slide.shopeePrice?.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs line-through mb-1 decoration-red-400">Rp {Math.floor((slide.shopeePrice || 0) * 1.5).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* DOTS INDICATOR (Logic disesuaikan agar Dot tidak kelebihan) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            // Jika currentIndex ada di Clone (terakhir), nyalakan dot pertama
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
              (currentIndex === slides.length ? 0 : currentIndex) === idx 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default Carousel;