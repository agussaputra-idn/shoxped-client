import { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  featuredProducts?: any[]; 
}

const Carousel = ({ featuredProducts = [] }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // DATA BANNER STATIS
  const staticBanners = [
    {
      id: 'static-1',
      type: 'static',
      bgClass: 'bg-gradient-to-r from-[#ee4d2d] to-orange-600',
      title: 'SHOPEE vs TIKTOK',
      subtitle: 'Mana Lebih Murah?',
      badge: 'CEK DISINI',
      image: 'https://cdn-icons-png.flaticon.com/512/2543/2543369.png' 
    },
    {
      id: 'static-2',
      type: 'static',
      bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      title: 'BELANJA CERDAS',
      subtitle: 'Jangan Sampai Boncos!',
      badge: 'TIPS HEMAT',
      image: 'https://cdn-icons-png.flaticon.com/512/2953/2953363.png'
    }
  ];

  // DATA PRODUK (Diambil dari props, maksimal 2 agar tidak bolong di mobile)
  const productSlides = featuredProducts.slice(0, 2).map((product) => ({
    id: product.id,
    type: 'product',
    bgClass: 'bg-white',
    title: product.title,
    subtitle: 'Rekomendasi Terbaik',
    price: product.shopeePrice,
    image: product.image,
    link: product.shopeeLink
  }));

  // GABUNGKAN DATA
  const originalSlides = [...staticBanners, ...productSlides];
  // CLONING UNTUK INFINITE LOOP
  const slides = [...originalSlides, { ...originalSlides[0], id: 'clone-start' }];

  // AUTO SCROLL
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // TELEPORTASI LOOPING
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
      {/* CONTAINER CAROUSEL */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide h-40 md:h-56 lg:h-64 rounded-xl w-full bg-gray-50 snap-x snap-mandatory"
        style={{ scrollBehavior: isTransitioning ? 'smooth' : 'auto' }}
      >
        {slides.map((slide, index) => (
          <div 
            key={`${slide.id}-${index}`} 
            className={`min-w-full w-full h-full flex items-center justify-between px-5 md:px-12 relative overflow-hidden snap-center ${slide.bgClass}`}
          >
            {/* STATIC BANNER */}
            {slide.type === 'static' && (
                <>
                    <div className="z-10 text-white drop-shadow-md max-w-[65%]">
                        <span className="bg-white/20 text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-2 inline-block backdrop-blur-sm border border-white/30">
                           {slide.badge}
                        </span>
                        <h2 className="text-xl md:text-3xl font-extrabold italic tracking-tight leading-none mb-1">
                            {slide.title}
                        </h2>
                        <p className="text-xs md:text-base font-medium opacity-90 mb-3">
                            {slide.subtitle}
                        </p>
                        <button className="bg-white text-orange-600 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                            Lihat Promo &gt;
                        </button>
                    </div>
                    <img 
                        src={slide.image} 
                        alt="Icon" 
                        className="h-20 md:h-32 object-contain z-10 opacity-90 rotate-12 transform translate-x-2 translate-y-2 drop-shadow-xl" 
                    />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                </>
            )}

            {/* PRODUCT BANNER */}
            {slide.type === 'product' && (
                <div 
                    className="flex w-full items-center justify-between h-full cursor-pointer relative" 
                    onClick={() => window.open(slide.link, '_blank')}
                >
                    <div className="flex-1 pr-2 z-10 py-2">
                        <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm mb-1 inline-block">
                            🔥 REKOMENDASI
                        </span>
                        <h3 className="text-gray-800 font-bold text-sm md:text-xl line-clamp-2 leading-tight mb-2">
                            {slide.title}
                        </h3>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Harga Terbaik</span>
                            <span className="text-[#ee4d2d] font-extrabold text-lg md:text-2xl">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(slide.price))}
                            </span>
                        </div>
                    </div>
                    <div className="w-[120px] md:w-[180px] h-[85%] bg-white p-2 rounded-lg shadow-lg transform rotate-3 border border-gray-100 flex items-center justify-center">
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* INDIKATOR DOTS */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20 bg-black/10 px-2 py-1 rounded-full backdrop-blur-[2px]">
        {originalSlides.map((_, index) => (
          <button
            key={index}
            className={`rounded-full transition-all duration-300 ${
              (currentIndex === index) || (currentIndex === slides.length - 1 && index === 0) 
              ? 'bg-orange-600 w-4 h-1.5' : 'bg-white/70 w-1.5 h-1.5 hover:bg-white'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;