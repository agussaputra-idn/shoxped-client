import { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  featuredProducts?: any[]; 
}

const Carousel = ({ featuredProducts = [] }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // === 1. BANNER STATIS (COPYWRITING EMOSIONAL) ===
  const staticBanners = [
    {
      id: 'static-1',
      type: 'static',
      bgClass: 'bg-gradient-to-r from-[#ee4d2d] via-red-600 to-black',
      title: 'STOP ASAL BELI!',
      subtitle: 'Yakin harga di keranjangmu sudah paling murah? Cek dulu disini!',
      badge: '⚠️ AWAS BONCOS',
      btnText: 'Buktikan Sekarang',
      image: 'https://cdn-icons-png.flaticon.com/512/3037/3037156.png' 
    },
    {
      id: 'static-2',
      type: 'static',
      bgClass: 'bg-gradient-to-r from-emerald-500 to-teal-700',
      title: 'RAHASIA CUAN',
      subtitle: 'Satu klik, hemat ribuan. Kenapa bayar lebih kalau barangnya sama?',
      badge: '💸 TIPS SULTAN',
      btnText: 'Mulai Hemat',
      image: 'https://cdn-icons-png.flaticon.com/512/2489/2489696.png'
    },
    {
      id: 'static-3',
      type: 'static',
      bgClass: 'bg-gradient-to-r from-purple-600 to-indigo-800',
      title: 'SHOXPED DULU',
      subtitle: 'Jadikan ritual wajib sebelum checkout. Dompet aman, hatipun tenang.',
      badge: '🧠 SMART BUYER',
      btnText: 'Coba Shoxped',
      image: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png'
    }
  ];

  // === 2. BANNER PRODUK DINAMIS (Dari Database) ===
  // Kita ambil 5 produk teratas yang dikirim dari Home
  const productSlides = featuredProducts.slice(0, 5).map((product) => {
    return {
      id: product.id,
      type: 'product',
      bgClass: 'bg-white',
      title: product.title,
      price: product.shopeePrice,
      image: product.image,
      shopeeLink: product.shopeeLink,
      sales: product.sales
    };
  });

  // Gabungkan: Banner Statis -> Produk -> Banner Statis lagi (biar selang seling kalau mau, atau gabung aja)
  const originalSlides = [...staticBanners, ...productSlides];
  
  // Cloning untuk efek infinite loop
  const slides = [...originalSlides, { ...originalSlides[0], id: 'clone-start' }];

  // Auto Scroll Logic
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
    }, 4500); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (currentIndex === slides.length - 1) {
        setIsTransitioning(true);
        scrollRef.current.scrollTo({
            left: scrollRef.current.offsetWidth * currentIndex,
            behavior: 'smooth'
        });
        const timeout = setTimeout(() => {
            setIsTransitioning(false); 
            scrollRef.current?.scrollTo({ left: 0, behavior: 'auto' }); 
            setCurrentIndex(0);
        }, 500);
        return () => clearTimeout(timeout);
    } 
    if (!isTransitioning) setIsTransitioning(true);
    scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * currentIndex,
        behavior: isTransitioning ? 'smooth' : 'auto'
    });
  }, [currentIndex, slides.length]);

  return (
    <div className="relative w-full group">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide h-44 md:h-60 lg:h-64 rounded-xl w-full bg-gray-50 snap-x snap-mandatory shadow-md border border-gray-100"
        style={{ scrollBehavior: isTransitioning ? 'smooth' : 'auto' }}
      >
        {slides.map((slide, index) => (
          <div 
            key={`${slide.id}-${index}`} 
            className={`min-w-full w-full h-full flex items-center justify-between px-5 md:px-10 relative overflow-hidden snap-center ${slide.bgClass}`}
          >
            {/* TAMPILAN BANNER STATIS (MERAH/HIJAU) */}
            {slide.type === 'static' && (
                <>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
                    <div className="z-10 text-white drop-shadow-md max-w-[70%]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-400 text-black text-[9px] md:text-xs font-black px-2 py-0.5 rounded shadow-sm animate-bounce">
                                {slide.badge}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-4xl font-black italic tracking-tighter leading-none mb-2 uppercase drop-shadow-lg">
                            {slide.title}
                        </h2>
                        <p className="text-xs md:text-sm font-medium opacity-90 mb-4 leading-snug text-white/90">
                            {slide.subtitle}
                        </p>
                        <button className="bg-white text-gray-900 text-[10px] md:text-xs font-bold px-5 py-2 rounded-full shadow-xl hover:scale-105 transition-transform">
                            {slide.btnText} ➔
                        </button>
                    </div>
                    <img src={slide.image} alt="Icon" className="h-24 md:h-40 object-contain z-10 rotate-6 transform translate-x-4 drop-shadow-2xl" />
                </>
            )}

            {/* TAMPILAN PRODUK (PUTIH) */}
            {slide.type === 'product' && (
                <div className="flex w-full items-center justify-between h-full cursor-pointer relative" onClick={() => window.open(slide.shopeeLink, '_blank')}>
                    <div className="flex-1 pr-4 z-10 py-2">
                        <div className="inline-flex items-center gap-1 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full mb-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                            <span className="text-red-600 text-[9px] font-bold uppercase tracking-wide">Lagi Viral 🔥</span>
                        </div>
                        <h3 className="text-gray-800 font-bold text-sm md:text-xl line-clamp-2 leading-tight mb-2">{slide.title}</h3>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-gray-400 font-medium line-through">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(slide.price) * 1.3)}
                            </span>
                            <span className="text-[#ee4d2d] font-black text-lg md:text-2xl">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(slide.price))}
                            </span>
                        </div>
                    </div>
                    <div className="relative w-[110px] md:w-[160px] h-[85%] transform rotate-2 bg-white p-2 rounded-lg shadow-lg border border-gray-100 flex items-center justify-center">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* INDIKATOR DOTS */}
      <div className="absolute bottom-3 left-6 flex space-x-1.5 z-20">
        {originalSlides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === index ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;