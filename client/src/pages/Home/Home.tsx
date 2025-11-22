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
    <div className='w-full'>
      
      <div className='w-full bg-gray-100'>
        <Carousel />
      </div>
      
      <div className='container mx-auto max-w-5xl py-10 px-4'>
        
        {/* === HERO SECTION (VERSI AMAN) === */}
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-800 leading-tight'>
            {/* Baris 1: Teks Judul (Dari Kamus) */}
            {t('home.heroTitleMain')}
            
            {/* Baris Baru (Manual di React) */}
            <br /> 
            
            {/* Baris 2: Shopee vs TikTok (Manual di React agar warnanya aman) */}
            <span className='text-primary'>Shopee</span> vs <span className='text-black'>TikTok Shop</span>
          </h1>
          
          <p className='mt-6 text-lg text-gray-600'>
            {t('home.heroSubtitle')}
          </p>
        </div>
        {/* ================================= */}

        <form
          className='mt-10 flex rounded-lg bg-white p-2 shadow-xl focus-within:ring-2 focus-within:ring-primary'
          onSubmit={handleSearch}
        >
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-grow border-none bg-transparent px-4 py-3 text-lg text-black outline-none'
            placeholder={t('header.searchPlaceholder')}
          />
          <button
            type='submit'
            className='flex-shrink-0 rounded-md bg-primary py-3 px-8 text-lg font-semibold text-white hover:opacity-90'
          >
            {t('home.searchButton')}
          </button>
        </form>

        <div className='mt-20 grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-800'>{t('home.feature1Title')}</h3>
            <p className='mt-2 text-gray-600'>{t('home.feature1Desc')}</p>
          </div>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-800'>{t('home.feature2Title')}</h3>
            <p className='mt-2 text-gray-600'>{t('home.feature2Desc')}</p>
          </div>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-800'>{t('home.feature3Title')}</h3>
            <p className='mt-2 text-gray-600'>{t('home.feature3Desc')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}