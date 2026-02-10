import React from 'react';
import { Link } from 'react-router-dom'; // ✅ INI YANG BENAR UNTUK VITE

// --- ICONS UNTUK MOBILE MENU ---
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconVideo = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconWishlist = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const IconProfile = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

const Footer = () => {

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      setTimeout(() => { searchInput.focus(); }, 500); 
    }
  };

  return (
    <>
      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-[999] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto relative">
          
          <Link to="/" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-[#ee4d2d] transition group">
            <IconHome />
            <span className="text-[9px] font-bold mt-1 group-hover:scale-105 transition">Home</span>
          </Link>

          <button onClick={handleSearchClick} className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-[#ee4d2d] transition group">
            <IconSearch />
            <span className="text-[9px] font-bold mt-1 group-hover:scale-105 transition">Cari</span>
          </button>

          <div className="relative w-1/5 flex justify-center">
              <Link to="/video-racun" className="absolute -top-6 bg-gradient-to-tr from-[#ee4d2d] to-[#ff7e5f] p-3.5 rounded-full shadow-lg shadow-orange-200 border-4 border-white hover:scale-110 transition-transform active:scale-95">
                  <IconVideo />
              </Link>
              <span className="absolute top-8 text-[9px] font-bold text-gray-400 mt-1">Racun</span>
          </div>

          <Link to="/wishlist" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-[#ee4d2d] transition group">
            <IconWishlist />
            <span className="text-[9px] font-bold mt-1 group-hover:scale-105 transition">Simpan</span>
          </Link>

          <Link to="/ruang-rahasia" className="flex flex-col items-center justify-center w-1/5 text-gray-400 hover:text-[#ee4d2d] transition group">
            <IconProfile />
            <span className="text-[9px] font-bold mt-1 group-hover:scale-105 transition">Akun</span>
          </Link>

        </div>
      </div>

      {/* DESKTOP FOOTER */}
      <footer className="hidden md:block bg-white border-t border-gray-100 mt-16">
        <div className="max-w-[900px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#ee4d2d]">Shox<span className="text-black">ped</span></h1>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Platform agregator perbandingan harga #1 di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Informasi</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                {/* Gunakan 'a' tag untuk link statis/eksternal atau 'Link' jika punya halamannya */}
                <li><a href="#" className="hover:text-[#ee4d2d]">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">Kebijakan Privasi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Ikuti Kami</h4>
              <div className="flex flex-col gap-3">
                <a href="https://facebook.com/shoxped" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ee4d2d]">Facebook</a>
                <a href="https://tiktok.com/@shoxped" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ee4d2d]">TikTok</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;