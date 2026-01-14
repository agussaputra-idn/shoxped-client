import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from 'src/context/LanguageContext'; // Import Hook Bahasa

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  
  // Panggil fungsi bahasa
  const { language, setLanguage, t } = useLanguage(); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?name=${encodeURIComponent(keyword)}`);
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto max-w-[1920px] px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group cursor-pointer">
           <div className="text-[#ee4d2d]">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9">
               <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="text-2xl md:text-3xl font-bold tracking-tight hidden md:block">
             <span className="text-gray-900">Shox</span>
             <span className="text-[#ee4d2d]">ped</span>
           </div>
        </Link>

        {/* 2. SEARCH BAR (Sekarang Placeholder berubah otomatis!) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative mx-4">
            <input 
              type="text" 
              placeholder={t.placeholder} 
              className="w-full border border-gray-300 rounded-md py-2.5 px-4 pr-24 text-sm focus:outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all bg-gray-50 focus:bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            {/* Tombol X Hapus */}
            {keyword && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#ee4d2d] text-white px-5 rounded-md hover:bg-orange-600 transition flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
        </form>

        {/* 3. MENU KANAN (BAHASA BERFUNGSI) */}
        <div className="flex items-center gap-4 text-gray-600 flex-shrink-0">
            <div className="flex gap-1 text-sm font-bold">
                <button 
                  onClick={() => setLanguage('id')}
                  className={`${language === 'id' ? 'text-[#ee4d2d] font-extrabold' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                >
                  ID
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`${language === 'en' ? 'text-[#ee4d2d] font-extrabold' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                >
                  EN
                </button>
            </div>
        </div>

      </div>
    </header>
  );
}