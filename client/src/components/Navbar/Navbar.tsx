import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Popover from '../Popover/Popover';
import { path } from 'src/constants/path';
import { AuthContext } from 'src/context/authContext';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORT HOOK

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);
  const { i18n, t } = useTranslation(); // <-- 2. INISIALISASI HOOK (dapat 'i18n' dan 't')

  const currentLanguage = i18n.language; // <-- Cek bahasa saat ini (misal: 'id' atau 'en')

  // Fungsi untuk mengganti bahasa
  const changeLanguage = (lng: 'id' | 'en') => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className='flex justify-end'>
      {/* === TOMBOL PENGGANTI BAHASA YANG BARU === */}
      <Popover
        className='flex cursor-pointer items-center py-1 hover:text-gray-300'
        renderPopover={
          <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
            <div className='flex flex-col py-2 px-3'>
              <button className='py-2 px-3 hover:text-primary' onClick={() => changeLanguage('id')}>
                Indonesia
              </button>
              <button className='py-2 px-3 hover:text-primary' onClick={() => changeLanguage('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c.25 0 .5-.02.744-.061M12 15c-2.485 0-4.5-2.015-4.5-4.5S9.515 6 12 6s4.5 2.015 4.5 4.5S14.485 15 12 15z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3v1m0 16v1m-6.04-2.17l-1.42-1.42m18.4 0l-1.42 1.42M3 12h1m16 0h1M5.77 5.77l-1.42 1.42M18.23 5.77l1.42 1.42'
          />
        </svg>
        <span className='mx-1'>{currentLanguage.toUpperCase()}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {/* === TOMBOL LOGIN/DAFTAR (SUDAH DITERJEMAHKAN) === */}
      {isAuthenticated ? (
        <Popover
          className='flex cursor-pointer items-center py-1 hover:text-gray-300'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <Link to={path.profile} className='block w-full bg-white py-2 px-3 hover:bg-slate-100'>
                Akun Saya
              </Link>
              <Link to={path.historyPurchase} className='block w-full bg-white py-2 px-3 hover:bg-slate-100'>
                Pembelian
              </Link>
              <button className='block w-full bg-white py-2 px-3 hover:bg-slate-100'>Logout</button>
            </div>
          }
        >
          {/* ... (kode untuk avatar, biarkan saja) ... */}
        </Popover>
      ) : (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-gray-300'>
            {t('header.signUp')}
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40' />
          <Link to={path.login} className='mx-3 capitalize hover:text-gray-300'>
            {t('header.login')}
          </Link>
        </div>
      )}
    </nav>
  );
}