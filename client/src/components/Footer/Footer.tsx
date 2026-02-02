import React from 'react';

const Footer = () => {
  return (
    /* hidden md:block agar hilang di mobile. bg-white agar bersih */
    <footer className="hidden md:block bg-white border-t border-gray-100 mt-16">
      {/* max-w-[1200px] mx-auto adalah kunci agar sejajar dengan konten atas */}
      <div className="max-w-[900px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* KOLOM 1: BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#ee4d2d]">Shox<span className="text-black">ped</span></h1>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform agregator perbandingan harga #1 di Indonesia. Bandingkan Shopee & TikTok Shop dalam satu klik.
            </p>
          </div>

          {/* KOLOM 2: INFORMASI (LINK AKTIF) */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Informasi</h4>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li><a href="/about" className="hover:text-[#ee4d2d] transition-colors">Tentang Kami</a></li>
              <li><a href="/privacy" className="hover:text-[#ee4d2d] transition-colors">Kebijakan Privasi</a></li>
              <li><a href="/terms" className="hover:text-[#ee4d2d] transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>

          {/* KOLOM 3: SOSIAL MEDIA (LINK AKTIF) */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Ikuti Kami</h4>
            <div className="flex flex-col gap-3">
              <a href="https://facebook.com/shoxped" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ee4d2d]">
                <span className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-[10px]">f</span> Facebook
              </a>
              <a href="https://instagram.com/shoxped" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ee4d2d]">
                <span className="w-5 h-5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center text-white text-[10px]">ig</span> Instagram
              </a>
              <a href="https://tiktok.com/@shoxped" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ee4d2d]">
                <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">tk</span> TikTok
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT & DISCLAIMER */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-xs text-gray-400">© 2026 Shoxped. All Rights Reserved.</p>
          <p className="text-[10px] text-gray-300 mt-2 italic">
            **Disclaimer:** Kami adalah mesin pencari, transaksi dilakukan di marketplace masing-masing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;