import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Carousel from 'src/components/Carousel/Carousel';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className='w-full flex flex-col min-h-screen'> 
      
      {/* Carousel di atas */}
      <div className='w-full bg-gray-100 flex-shrink-0'>
        <Carousel />
      </div>
      
      {/* CONTAINER UTAMA: Padding disesuaikan (py-8) */}
      <div className='container mx-auto max-w-5xl py-8 px-4 flex-grow flex flex-col justify-start'>
        
        {/* HERO SECTION */}
        <div className='text-center'>
          <h1 className='text-3xl md:text-5xl font-bold text-gray-800 leading-tight'>
            {t('home.heroTitlePrefix') || "Temukan Harga Terbaik"}
             <br className="hidden md:block" /> 
             <span className="inline-block ml-1 mt-2 md:mt-0">
               <span className='text-primary'>Shopee</span> vs <span className='text-black'>TikTok Shop</span>
             </span>
          </h1>
          
          <p className='mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* SEARCH BAR */}
        <form
          className='mt-8 flex rounded-lg bg-white p-2 shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-primary w-full max-w-3xl mx-auto'
          onSubmit={handleSearch}
        >
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-grow border-none bg-transparent px-4 py-3 text-base md:text-lg text-black outline-none placeholder-gray-400'
            placeholder={t('header.searchPlaceholder')}
          />
          <button
            type='submit'
            className='flex-shrink-0 rounded-md bg-primary py-3 px-8 text-base md:text-lg font-semibold text-white hover:bg-orange-600 transition-colors'
          >
            {t('home.searchButton')}
          </button>
        </form>

        {/* FITUR-FITUR */}
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 text-center'>
          <div className='p-4 rounded-lg hover:bg-gray-50 transition-all'>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>{t('home.feature1Title')}</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>{t('home.feature1Desc')}</p>
          </div>
          <div className='p-4 rounded-lg hover:bg-gray-50 transition-all'>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>{t('home.feature2Title')}</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>{t('home.feature2Desc')}</p>
          </div>
          <div className='p-4 rounded-lg hover:bg-gray-50 transition-all'>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>{t('home.feature3Title')}</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>{t('home.feature3Desc')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}