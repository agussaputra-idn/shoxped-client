import { Link } from 'react-router-dom';
import { path } from 'src/constants/path';
import facebook from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import tiktok from '../../assets/images/tiktok.png';
import youtube from '../../assets/images/youtube.png';

const Footer = () => {
  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='container'>
        
        {/* === GRID 3 KOLOM (Presisi Sejajar dengan Bagian Atas) === */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
          
          {/* === KOLOM 1: CUSTOMER SERVICE === */}
          {/* 'w-fit mx-auto' membuat blok ini berada PERSIS di tengah kolom 1 */}
          <div className='w-fit mx-auto'> 
            <p className='text-sm font-semibold text-gray-600'>CUSTOMER SERVICE</p>
            <div className='mt-4 flex flex-col gap-2'>
              <Link to={path.howToUse} className='text-sm text-secondary hover:text-primary'>
                Cara Menggunakan Shoxped
              </Link>
              <Link to={path.faq} className='text-sm text-secondary hover:text-primary'>
                Pertanyaan Umum (FAQ)
              </Link>
              <Link to={path.orderIssues} className='text-sm text-secondary hover:text-primary'>
                Masalah Pemesanan & Pengembalian
              </Link>
              <Link to={path.contactUs} className='text-sm text-secondary hover:text-primary'>
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* === KOLOM 2: ABOUT SHOXPED === */}
          {/* 'w-fit mx-auto' membuat blok ini berada PERSIS di tengah kolom 2 */}
          <div className='w-fit mx-auto'>
            <p className='text-sm font-semibold text-gray-600'>ABOUT SHOXPED</p>
            <div className='mt-4 flex flex-col gap-2'>
              <Link to={path.aboutUs} className='text-sm text-secondary hover:text-primary'>
                Tentang Kami
              </Link>
              <Link to={path.howWeWork} className='text-sm text-secondary hover:text-primary'>
                Cara Kami Bekerja
              </Link>
              <Link to={path.partners} className='text-sm text-secondary hover:text-primary'>
                Partner Kami
              </Link>
              <Link to={path.privacyPolicy} className='text-sm text-secondary hover:text-primary'>
                Kebijakan Privasi
              </Link>
              <Link to={path.terms} className='text-sm text-secondary hover:text-primary'>
                Syarat & Ketentuan
              </Link>
            </div>
          </div>

          {/* === KOLOM 3: FOLLOW US === */}
          {/* 'w-fit mx-auto' membuat blok ini berada PERSIS di tengah kolom 3 */}
          <div className='w-fit mx-auto'>
            <p className='text-sm font-semibold text-gray-600'>FOLLOW US</p>
            <div className='mt-4 flex flex-col gap-3'>
              <a
                href='https://www.facebook.com/share/17YdJNxgJ5/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-sm text-secondary hover:text-primary'
              >
                <div className='mr-1'>
                  <img src={facebook} alt='facebook' width={18} height={18} />
                </div>
                <span> Facebook</span>
              </a>
              <a
                href='https://www.instagram.com/shoxped?igsh=czZsYm5mNmlnZXk2'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-sm text-secondary hover:text-primary'
              >
                <div className='mr-1'>
                  <img src={instagram} alt='instagram' width={18} height={18} />
                </div>
                <span> Instagram</span>
              </a>
              <a
                href='http://tiktok.com/@shoxped'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-sm text-secondary hover:text-primary'
              >
                <div className='mr-1'>
                  <img src={tiktok} alt='tiktok' width={18} height={18} />
                </div>
                <span>Tiktok</span>
              </a>
              <a
                href='/' 
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-sm text-secondary hover:text-primary'
              >
                <div className='mr-1'>
                  <img src={youtube} alt='youtube' width={18} height={18} />
                </div>
                <span>Youtube</span>
              </a>
            </div>
          </div>
          
        </div>
        
        {/* === GARIS PEMISAH === */}
        <hr />

        <div className='mt-10 text-center text-sm text-gray-600'>
          <p className=''>
            © 2025 Shoxped. All Rights Reserved.
          </p>
          <p className='mt-4'>
            Kontak Email: customer@support.shoxped.id
          </p>
          <p className='mt-4 max-w-3xl mx-auto'>
            <strong>Disclaimer:</strong> Shoxped adalah layanan agregator afiliasi. Kami tidak menjual, mengirim, atau memproses pembayaran untuk produk apa pun. Semua transaksi dan layanan pelanggan (termasuk pengembalian) ditangani langsung oleh Shopee dan TikTok.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;