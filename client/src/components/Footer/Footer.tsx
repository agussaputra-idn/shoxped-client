import { useTranslation } from 'react-i18next'; // <-- 1. IMPORT HOOK
import facebook from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import tiktok from '../../assets/images/tiktok.png';
import youtube from '../../assets/images/youtube.png';

const Footer = () => {
  const { t } = useTranslation(); // <-- 2. INISIALISASI HOOK

  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='flex flex-col md:flex-row justify-center gap-10 md:gap-20 mb-5'>
          
          {/* === 3. GANTI TEKS DENGAN VARIABEL t(...) === */}
          <div>
            <p className='text-sm font-semibold text-gray-600'>{t('footer.customerService')}</p>
            <div className='mt-4 flex flex-col gap-2'>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.cs.howToUse')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.cs.faq')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.cs.orderIssues')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.cs.contactUs')}
              </a>
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-gray-600'>{t('footer.aboutShoxped')}</p>
            <div className='mt-4 flex flex-col gap-2'>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.about.aboutUs')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.about.howWeWork')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.about.ourPartners')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.about.privacyPolicy')}
              </a>
              <a href='/' className='text-sm text-secondary hover:text-primary'>
                {t('footer.about.terms')}
              </a>
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-gray-600'>{t('footer.followUs')}</p>
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
        
        <hr />

        <div className='mt-10 text-center text-sm text-gray-600'>
          <p className=''>{t('footer.copyright')}</p>
          <p className='mt-4'>{t('footer.email')}</p>
          <p className='mt-4 max-w-3xl mx-auto'>
            <strong>Disclaimer:</strong> {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;