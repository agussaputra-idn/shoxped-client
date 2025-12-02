import React, { useState, useEffect } from 'react';

// Gambar Produk Asli (Unsplash)
const images = [
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className='relative w-full overflow-hidden bg-gray-200'>
      {/* PERBAIKAN: Ukuran dikembalikan ke versi LEBAR/TINGGI
          Mobile: h-48 (192px)
          Tablet: h-64 (256px)
          Desktop: h-80 (320px)
      */}
      <div className='relative w-full h-48 md:h-64 lg:h-80'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Promo Slide ${index + 1}`} 
              className='w-full h-full object-cover object-center' 
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;