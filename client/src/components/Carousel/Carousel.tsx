import React, { useState, useEffect } from 'react';

// Definisi tipe data untuk setiap slide
type SlideData = {
  type: 'image' | 'custom';
  content: string; 
  title?: React.ReactNode;
  subtitle?: string;
  buttonText?: string;
};

const Carousel = () => {
  // === DATA SLIDE ===
  const slides: SlideData[] = [
    // SLIDE 1: Gambar Tas Belanja (Shopee vs TikTok)
    { 
      type: 'image', 
      content: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      title: (
        <span>
          <span className="text-[#ee4d2d]">Shopee</span> atau <span className="text-black">TikTok</span>?
        </span>
      ),
      subtitle: 'Cek dulu disini. Mana yang lebih murah?',
      buttonText: 'Bandingkan Sekarang'
    },
    // SLIDE 2: Banner Custom Oranye
    { 
      type: 'custom', 
      content: 'Banner Edukasi' 
    },
    // SLIDE 3: Gambar Fashion (Wanita belanja)
    { 
      type: 'image', 
      content: 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?auto=format&fit=crop&w=1200&q=80',
      title: <span className="text-gray-900">Jangan Sampai Boncos!</span>,
      subtitle: 'Bandingkan harga di Shoxped sebelum checkout.',
      buttonText: 'Mulai Hemat'
    },
    // SLIDE 4: Gambar Belanja Online (LINK SUDAH DIPERBAIKI)
    {
      type: 'image',
      // URL Gambar Baru: Konsep belanja online dengan laptop
      content: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
      title: <span className="text-gray-900">Pasti Lebih Untung</span>,
      subtitle: 'Satu aplikasi untuk temukan penawaran terbaik.',
      buttonText: 'Belanja Cerdas'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide setiap 6 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className='relative w-full overflow-hidden bg-gray-100 rounded-xl shadow-sm group'>
      {/* Container Tinggi Responsif */}
      <div className='relative w-full h-48 md:h-64 lg:h-80'>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.type === 'image' ? (
              // === TAMPILAN SLIDE GAMBAR DENGAN GLASS CARD ===
              <div className="relative w-full h-full">
                {/* Gambar Background */}
                <img 
                  src={slide.content} 
                  alt={`Promo ${index + 1}`} 
                  className='w-full h-full object-cover object-center' 
                  // Error handling jika gambar gagal muat lagi
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x800?text=Gagal+Memuat+Gambar';
                  }}
                />
                
                {/* CONTAINER TEXT: Flexbox Center untuk menaruh di tengah */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  
                  {/* GLASS CARD EFFECT */}
                  <div className={`
                    bg-white/90 backdrop-blur-sm border border-white/50 
                    px-6 py-5 md:px-10 md:py-8 rounded-2xl shadow-xl 
                    text-center max-w-lg w-full transform transition-all duration-700
                    ${index === currentIndex ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
                  `}>
                    
                    {/* Judul Utama */}
                    {slide.title && (
                      <h2 className="text-2xl md:text-4xl font-extrabold mb-2 tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                    )}
                    
                    {/* Sub-judul */}
                    {slide.subtitle && (
                      <p className="text-gray-600 text-sm md:text-base font-medium mb-5">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Tombol Action */}
                    {slide.buttonText && (
                      <button className="bg-[#ea580c] hover:bg-orange-600 text-white text-xs md:text-sm font-bold py-2.5 px-6 rounded-full transition-transform hover:scale-105 shadow-md">
                        {slide.buttonText}
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ) : (
              // === TAMPILAN SLIDE CUSTOM (ORANYE) ===
              <div className="w-full h-full flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-r from-orange-500 via-[#ee4d2d] to-red-600">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
                
                <div className="text-center text-white relative z-10">
                  <h2 className="text-2xl md:text-5xl font-extrabold mb-3 drop-shadow-sm tracking-tight">
                    Temukan Harga Terbaik
                  </h2>
                  <div className="flex items-center justify-center gap-3 text-lg md:text-2xl font-bold bg-white text-orange-600 py-3 px-8 rounded-full inline-block mt-2 shadow-lg">
                    <span>Shopee</span>
                    <span className="text-gray-400 text-sm font-normal">VS</span>
                    <span className="text-black">TikTok Shop</span>
                  </div>
                  <p className="mt-6 text-sm md:text-base text-white font-medium opacity-90 hidden md:block">
                    Satu kali cari, bandingkan dua platform terbesar di Indonesia.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indikator Dot */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              index === currentIndex ? 'bg-[#ea580c] w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;