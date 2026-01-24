import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Import Gambar
import facebook from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import tiktok from '../../assets/images/tiktok.png';
import youtube from '../../assets/images/youtube.png';

const Footer = () => {
  // === SCRIPT AUTO SCROLL ===
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);

  return (
    <footer className='bg-neutral-100 py-16'>
      {/* Container Rata Tengah */}
      <div className='container mx-auto px-4'>
        
        {/* GRID 3 KOLOM (Semua Rata Tengah) */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center'>
          
          {/* === KOLOM 1: BRAND IDENTITY === */}
          <div className='flex flex-col items-center'> 
            {/* UPDATE WARNA: Pakai kode hex khusus biar cerah */}
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-black">Shox</span>
              <span className="text-[#FF6600]">ped</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
              Platform agregator perbandingan harga #1 di Indonesia. 
              Temukan harga termurah dari Shopee & TikTok Shop dalam satu klik.
            </p>
          </div>

          {/* === KOLOM 2: INFORMASI LEGAL === */}
          <div className='flex flex-col items-center'>
            <p className='text-sm font-semibold text-gray-800 uppercase mb-4'>INFORMASI</p>
            <div className='flex flex-col gap-3'>
              {/* Hover pakai kode hex khusus */}
              <Link to="/about-us" className='text-sm text-gray-600 hover:text-[#FF6600] transition-colors'>
                Tentang Kami
              </Link>
              <Link to="/privacy-policy" className='text-sm text-gray-600 hover:text-[#FF6600] transition-colors'>
                Kebijakan Privasi
              </Link>
              <Link to="/terms-conditions" className='text-sm text-gray-600 hover:text-[#FF6600] transition-colors'>
                Syarat & Ketentuan
              </Link>
            </div>
          </div>

          {/* === KOLOM 3: SOCIAL MEDIA === */}
          <div className='flex flex-col items-center'>
            <p className='text-sm font-semibold text-gray-800 uppercase mb-4'>IKUTI KAMI</p>
            <div className='flex flex-col gap-3 items-center'> 
              <a href='https://www.facebook.com/share/17YdJNxgJ5/' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6600] group'>
                <img src={facebook} alt='facebook' width={20} height={20} className="group-hover:opacity-80"/>
                <span>Facebook</span>
              </a>
              <a href='https://www.instagram.com/shoxped?igsh=czZsYm5mNmlnZXk2' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6600] group'>
                <img src={instagram} alt='instagram' width={20} height={20} className="group-hover:opacity-80"/>
                <span>Instagram</span>
              </a>
              <a href='http://tiktok.com/@shoxped' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6600] group'>
                <img src={tiktok} alt='tiktok' width={20} height={20} className="group-hover:opacity-80"/>
                <span>Tiktok</span>
              </a>
              <a href='/' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6600] group'>
                <img src={youtube} alt='youtube' width={20} height={20} className="group-hover:opacity-80"/>
                <span>Youtube</span>
              </a>
            </div>
          </div>
          
        </div>
        
        <hr className="border-gray-200" />

        <div className='mt-10 text-center text-xs text-gray-400'>
          <p>© 2026 Shoxped. All Rights Reserved.</p>
          <p className='mt-2'>Kontak: customer@support.shoxped.id</p>
          <p className='mt-4 max-w-3xl mx-auto'>
            **Disclaimer:** Shoxped adalah mesin pencari produk. Transaksi, pembayaran, dan pengiriman sepenuhnya ditangani oleh marketplace terkait (Shopee/TikTok).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;