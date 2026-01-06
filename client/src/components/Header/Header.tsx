import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { path } from 'src/constants/path';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
    }
  };

  const changeLanguage = (lng: 'id' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language || 'id';

  // WARNA CONFIG
  const orangeColor = '#ea580c'; 
  const blackColor = '#1f2937';

  return (
    <div className='w-full bg-white text-gray-700 shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      {/* Container: Padding kiri-kanan dikurangi di mobile (px-2) agar lebih luas */}
      <div className='w-full px-2 md:px-8 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4 max-w-[1920px] mx-auto'>
        
        {/* === LOGO SECTION === */}
        <Link to={path.home} className='flex items-center flex-shrink-0 group'>
          
          {/* LOGO SVG (Ukuran disesuaikan untuk mobile) */}
          <svg 
            className="h-8 w-8 md:h-11 md:w-11 mr-1 md:mr-2" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d='M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm-9-1a2 2 0 012-2 2 2 0 012 2v1h-4V6zm0 4a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0z' 
              fill={orangeColor}
            />
            <path 
              d='M9 13l2 2 4-4' 
              fill='none' 
              stroke='#000000' 
              strokeWidth='2' 
              strokeLinecap='round' 
              strokeLinejoin='round'
            />
          </svg>

          {/* TULISAN SHOXPED (HANYA MUNCUL DI LAPTOP/MD KE ATAS) */}
          {/* Di HP (Mobile) tulisan ini akan hilang supaya Search Bar muat */}
          <div className='hidden md:flex text-3xl md:text-4xl font-black tracking-tighter group-hover:opacity-90 transition'>
            <span style={{ color: blackColor }}>Shox</span>
            <span style={{ color: orangeColor }}>ped</span>
          </div>
        </Link>

        {/* === SEARCH BAR === */}
        {/* Margin kiri dikurangi di mobile (ml-1) */}
        <form className='flex-grow max-w-5xl ml-1 md:mx-4' onSubmit={handleSearch}>
          <div className='flex w-full rounded-md border border-gray-300 bg-gray-50 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-grow border-none bg-transparent px-3 py-2 md:px-4 md:py-2.5 text-black outline-none text-xs md:text-base placeholder-gray-400'
              placeholder={t('header.searchPlaceholder') || "Cari produk..."}
            />
            <button
              type='submit'
              className='flex-shrink-0 px-3 md:px-6 flex items-center justify-center transition-colors text-white'
              style={{ backgroundColor: orangeColor }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='h-4 w-4 md:h-5 md:w-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
              </svg>
            </button>
          </div>
        </form>

        {/* === BAHASA === */}
        {/* Di HP disederhanakan tampilannya (hanya ID/EN kecil jika perlu, atau hidden) */}
        <div className='hidden md:flex items-center text-sm font-medium gap-2'>
          <button 
            onClick={() => changeLanguage('id')} 
            className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'id' ? 'font-bold bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}
          >
            ID
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => changeLanguage('en')} 
            className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'en' ? 'font-bold bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}
          >
            EN
          </button>
        </div>

      </div>
    </div>
  );
}