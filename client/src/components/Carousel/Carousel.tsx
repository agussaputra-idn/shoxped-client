import React, { useState, useEffect } from 'react';

const images = [
  'https://placehold.co/1200x400/FF5733/FFFFFF?text=Promo+Spesial+Shoxped',
  'https://placehold.co/1200x400/33FF57/000000?text=Flash+Sale+TikTok',
  'https://placehold.co/1200x400/3357FF/FFFFFF?text=Gratis+Ongkir+Hari+Ini',
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative w-full overflow-hidden bg-gray-200'>
      <div className='relative w-full h-32 md:h-44 lg:h-56'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
              className='w-full h-full object-cover' 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;