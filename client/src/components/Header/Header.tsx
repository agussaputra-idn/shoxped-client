import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from 'src/context/LanguageContext';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage(); 

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
    <header className="w-full bg-white shadow-sm py-3 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto max-w-[1920px] px-4 md:px-8 flex items-center justify-between gap-2 md:gap-8">
        
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group cursor-pointer mr-2">
           <div className="text-[#ee4d2d]">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9 group-hover:scale-105 transition-transform">
               <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="text-2xl md:text-3xl font-bold tracking-tight hidden md:block">
             <span className="text-gray-900">Shox</span>
             <span className="text-[#ee4d2d]">ped</span>
           </div>
        </Link>

        {/* 2. SEARCH BAR (LEBAR & GANTENG) */}
        {/* Update: max-w-5xl dan margin diatur biar lega */}
        <form onSubmit={handleSearch} className="flex-1 max-w-5xl relative mx-2 md:mx-6 transition-all duration-300">
            <input 
              type="text" 
              placeholder={t.placeholder || "Cari produk di Shoxped..."}
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 pr-14 md:pr-24 text-sm focus:outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all bg-gray-50 focus:bg-white shadow-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <div className="absolute right-1.5 top-1 bottom-1 flex items-center">
                {/* Tombol Clear */}
                {keyword && (
                  <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition mr-1">
                    <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}

                <div className="w-[1px] h-6 bg-gray-200 mx-1 hidden md:block"></div>

                {/* Tombol Search */}
                <button type="submit" className="bg-[#ee4d2d] text-white px-3 md:px-6 py-1.5 md:py-1.5 rounded-md hover:bg-orange-600 transition flex items-center justify-center shadow-sm h-full">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
            </div>
        </form>

        {/* 3. MENU KANAN (BERSIH - CUMA HAMBURGER BUAT MOBILE) */}
        {/* Tombol Wishlist SUDAH DIHAPUS dari sini sesuai request */}
        <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Hamburger Menu (Mobile Only) */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-[#ee4d2d]">
               {isMobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
        </div>

      </div>
    </header>
  );
}