import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from 'src/context/LanguageContext';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { t } = useLanguage(); 

  // Deteksi perubahan ukuran layar untuk hilangkan logo secara real-time
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?name=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm py-2 sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-8 flex items-center justify-between">
        
        {/* 1. LOGO: Dipaksa HILANG TOTAL di mobile pakai Style Inline */}
        {!isMobile && (
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
             <div className="text-[#ee4d2d]">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
                 <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
               </svg>
             </div>
             <div className="text-2xl md:text-3xl font-bold">
               <span className="text-gray-900">Shox</span><span className="text-[#ee4d2d]">ped</span>
             </div>
          </Link>
        )}

        {/* 2. SEARCH BAR: Mengambil 100% sisa ruang */}
        <form 
          onSubmit={handleSearch} 
          style={{ width: isMobile ? '100%' : 'auto' }}
          className="flex-grow max-w-5xl relative"
        >
            <div className="relative flex items-center w-full">
              <input 
                type="text" 
                placeholder={t.placeholder || "Cari 200rb+ produk..."}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 pr-12 text-sm focus:outline-none focus:border-[#ee4d2d] bg-gray-50 shadow-sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full bg-[#ee4d2d] text-white px-4 rounded-r-lg"
              >
                  <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
        </form>

      </div>
    </header>
  );
}