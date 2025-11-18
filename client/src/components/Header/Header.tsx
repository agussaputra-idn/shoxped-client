import { Link, useLocation, useNavigate } from 'react-router-dom'; // <-- Import baru
import { useState } from 'react'; // <-- Import baru
import Navbar from '../Navbar/Navbar';
import { useTranslation } from 'react-i18next'; // <-- Import baru

export default function Header() {
  // === LOGIKA PENCARIAN BARU (dari Home.tsx) ===
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mendapatkan URL saat ini
  const { t } = useTranslation(); // Hook untuk kamus bahasa

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Arahkan ke halaman hasil pencarian /search
    navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
    setSearchTerm(''); // Kosongkan search bar header
  };

  // Cek apakah kita sedang di Halaman Depan (path = '/')
  const isHomePage = location.pathname === '/';
  // ==========================================

  return (
    <div className='bg-primary pb-5 pt-2 text-white'>
      <div className='container'>
        <Navbar />
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          {/* Logo "Shoxped" */}
          <Link to='/' className='col-span-2 flex h-11 items-center'>
            <div className='text-3xl font-bold text-white'>Shoxped</div>
          </Link>

          {/* === KONDISI TAMPILKAN SEARCH BAR === */}
          {/* Jika BUKAN Halaman Depan (!isHomePage), TAMPILKAN search bar */}
          {!isHomePage && (
            <form className='col-span-9' onSubmit={handleSearch}>
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
                    className='h-6 w-6'
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
          {/* ================================== */}

        </div>
      </div>
    </div>
  );
}