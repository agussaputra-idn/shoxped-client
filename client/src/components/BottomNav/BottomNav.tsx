// src/components/BottomNav/BottomNav.tsx
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper cek menu aktif
  const isActive = (path: string) => location.pathname === path;

  // Daftar Menu Navigasi
  const menus = [
    {
      label: 'Beranda',
      path: '/',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "2"} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      label: 'Cari',
      path: '/search',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "2" : "2"} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )
    },
    {
      // MENU SPESIAL: VIDEO (Lebih Besar & Menonjol)
      label: 'Video',
      path: '/video-feed', // Pastikan route ini ada nanti
      isHighlight: true, 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.5 6v12l2.625-2.625a1.5 1.5 0 00.44-1.06l-.003-4.63a1.5 1.5 0 00-.437-1.06L19.5 6z" />
        </svg>
      )
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "2"} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    },
    {
      label: 'Saya',
      path: '/profile',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "2"} className="w-6 h-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ];

  return (
    // Hanya muncul di layar Mobile & Tablet (md:hidden)
    // Jika ingin muncul di desktop juga, hapus 'md:hidden'
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-between items-center px-4 h-[60px] max-w-md mx-auto md:max-w-full md:justify-center md:gap-10">
        {menus.map((menu, index) => {
          const active = isActive(menu.path);
          
          if (menu.isHighlight) {
            return (
              <button 
                key={index}
                onClick={() => navigate(menu.path)}
                className="relative -top-5 bg-[#ee4d2d] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-orange-200 border-4 border-gray-50 transform active:scale-95 transition-transform"
              >
                {menu.icon(true)}
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => navigate(menu.path)}
              className={`flex flex-col items-center justify-center w-full md:w-auto h-full gap-1 active:scale-95 transition-transform ${
                active ? 'text-[#ee4d2d]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="mb-0.5">
                {menu.icon(active)}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>
                {menu.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}