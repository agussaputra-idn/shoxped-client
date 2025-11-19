import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
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
      
      {/* 1. Carousel (Tetap di atas) */}
      <div className='w-full bg-gray-100'>
        <Carousel />
      </div>
      
      {/* PERBAIKAN 1: Mengurangi padding container utama 
         Dulu: py-10 (40px) -> Sekarang: py-6 (24px)
      */}
      <div className='container mx-auto max-w-5xl py-6 px-4'>
        
        {/* PERBAIKAN 2: Hero Section lebih rapat
           Judul font size: text-5xl -> text-4xl (sedikit lebih kecil agar muat)
        */}
        <div className='text-center'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 leading-tight'>
            <Trans i18nKey="home.heroTitle">
              Temukan Harga Terbaik
              <br /> 
              <span className='text-primary'>Shopee</span> vs <span className='text-black'>TikTok Shop</span>
            </Trans>
          </h1>
          
          {/* Mengurangi margin top (mt-6 -> mt-3) */}
          <p className='mt-3 text-base md:text-lg text-gray-600'>
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* PERBAIKAN 3: Search Bar lebih rapat ke atas
           Dulu: mt-10 -> Sekarang: mt-6
        */}
        <form
          className='mt-6 flex rounded-lg bg-white p-2 shadow-xl focus-within:ring-2 focus-within:ring-primary max-w-3xl mx-auto'
          onSubmit={handleSearch}
        >
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-grow border-none bg-transparent px-4 py-2 text-base md:text-lg text-black outline-none'
            placeholder={t('header.searchPlaceholder')}
          />
          <button
            type='submit'
            className='flex-shrink-0 rounded-md bg-primary py-2 px-6 text-base md:text-lg font-semibold text-white hover:opacity-90'
          >
            {t('home.searchButton')}
          </button>
        </form>

        {/* PERBAIKAN 4: Fitur-Fitur (3 Kolom) dinaikkan drastis
           Dulu: mt-20 -> Sekarang: mt-8
        */}
        <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8'>
          
          {/* Fitur 1 */}
          <div className='text-center p-3 rounded-lg hover:bg-gray-50 transition-colors'>
            <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-1'>
              {t('home.feature1Title')}
            </h3>
            <p className='text-sm md:text-base text-gray-600 leading-snug'>
              {t('home.feature1Desc')}
            </p>
          </div>

          {/* Fitur 2 */}
          <div className='text-center p-3 rounded-lg hover:bg-gray-50 transition-colors'>
            <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-1'>
              {t('home.feature2Title')}
            </h3>
            <p className='text-sm md:text-base text-gray-600 leading-snug'>
              {t('home.feature2Desc')}
            </p>
          </div>

          {/* Fitur 3 */}
          <div className='text-center p-3 rounded-lg hover:bg-gray-50 transition-colors'>
            <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-1'>
              {t('home.feature3Title')}
            </h3>
            <p className='text-sm md:text-base text-gray-600 leading-snug'>
              {t('home.feature3Desc')}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}