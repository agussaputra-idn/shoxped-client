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
    <div className='bg-primary text-white'> {/* Kurangi padding vertikal */}
      <div className='container py-2 flex items-center justify-between'> {/* Padding vertikal sedikit, align center */}
        
        {/* Logo Shoxped */}
        <Link to={path.home} className='flex items-center h-full'>
          {/* Presisi dengan padding dan font size */}
          <div className='text-3xl font-bold tracking-tight'>Shoxped</div> 
        </Link>

        {/* Search Bar (Hanya muncul jika BUKAN halaman Home) */}
        {!isHomePage && (
          <form className='flex-grow mx-4' onSubmit={handleSearch}> {/* flex-grow agar mengisi ruang */}
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder={t('header.searchPlaceholder')}
              />
              <button
                type='submit'
                className='flex-shrink-0 rounded-sm bg-primary py-2 px-6 hover:opacity-90'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6 text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
        )}
        
        {/* Pilihan Bahasa */}
        <div className='flex items-center text-sm ml-auto'> {/* ml-auto dorong ke kanan */}
          <button 
            onClick={() => changeLanguage('id')} 
            className={`mx-1 hover:text-gray-200 ${currentLanguage === 'id' ? 'font-bold' : ''}`}
          >
            Indonesia
          </button>
          |
          <button 
            onClick={() => changeLanguage('en')} 
            className={`mx-1 hover:text-gray-200 ${currentLanguage === 'en' ? 'font-bold' : ''}`}
          >
            English
          </button>
        </div>

      </div>
    </div>
  );
}