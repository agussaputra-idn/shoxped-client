// src/components/BottomNav/BottomNav.tsx
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menus = [
    {
      label: 'Beranda',
      path: '/',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "1.8"} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      label: 'Cari',
      path: '/search',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth="1.8" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )
    },
    {
      label: 'Video',
      path: '/video',
      isHighlight: true, 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5 -rotate-45">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.5 6v12l2.625-2.625a1.5 1.5 0 00.44-1.06l-.003-4.63a1.5 1.5 0 00-.437-1.06L19.5 6z" />
        </svg>
      )
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "1.8"} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    },
    {
      label: 'Saya',
      path: '/profile',
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "#ee4d2d" : "none"} stroke={active ? "#ee4d2d" : "currentColor"} strokeWidth={active ? "0" : "1.8"} className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe">
      <div className="flex justify-between items-center px-1 h-[56px] max-w-md mx-auto">
        {menus.map((menu, index) => {
          const active = isActive(menu.path);
          
          if (menu.isHighlight) {
            return (
              <div key={index} className="relative flex flex-col items-center">
                <button 
                  onClick={() => navigate(menu.path)}
                  className="relative -top-4 bg-gradient-to-tr from-[#ee4d2d] to-orange-400 w-11 h-11 rounded-xl rotate-45 flex items-center justify-center shadow-md shadow-orange-100 border-[3px] border-white transform active:scale-90 transition-all duration-200"
                >
                  {menu.icon(true)}
                </button>
                <span className={`absolute -bottom-1 text-[9px] font-bold ${active ? 'text-[#ee4d2d]' : 'text-gray-400'}`}>
                  {menu.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() => navigate(menu.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 active:scale-90 transition-all ${
                active ? 'text-[#ee4d2d]' : 'text-gray-400'
              }`}
            >
              <div className="transform transition-transform duration-300">
                {menu.icon(active)}
              </div>
              <span className={`text-[9px] font-medium ${active ? 'font-bold' : ''}`}>
                {menu.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}