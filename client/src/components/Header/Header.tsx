import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { path } from 'src/constants/path';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  const changeLanguage = (lng: 'id' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const isHomePage = location.pathname === '/';
  const currentLanguage = i18n.language || 'id';

  return (
    <div className='bg-primary text-white shadow-md'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        
        {/* KIRI: Logo Shoxped */}
        <Link to={path.home} className='flex items-center'>
          <div className='text-3xl font-black tracking-tighter'>Shoxped</div>
        </Link>

        {/* TENGAH: Search Bar (Hanya muncul jika BUKAN halaman Home) */}
        {!isHomePage && (
          <form className='hidden md:flex flex-grow max-w-xl mx-8' onSubmit={handleSearch}>
            <div className='flex w-full rounded-md bg-white p-1'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-grow border-none bg-transparent px-3 py-1 text-black outline-none text-sm'
                placeholder={t('header.searchPlaceholder')}
              />
              <button
                type='submit'
                className='flex-shrink-0 rounded-sm bg-primary py-1 px-4 hover:opacity-90 flex items-center justify-center'
              >
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='h-4 w-4 text-white'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* KANAN: Navigasi Bahasa */}
        <div className='flex items-center text-sm font-medium'>
          <button 
            onClick={() => changeLanguage('id')} 
            className={`hover:text-gray-200 transition-colors ${currentLanguage === 'id' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
          >
            Indonesia
          </button>
          <span className="mx-2 opacity-50">|</span>
          <button 
            onClick={() => changeLanguage('en')} 
            className={`hover:text-gray-200 transition-colors ${currentLanguage === 'en' ? 'opacity-100 border-b-2 border-white' : 'opacity-70'}`}
          >
            English
          </button>
        </div>

      </div>
    </div>
  );
}