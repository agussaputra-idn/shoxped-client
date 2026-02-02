import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';       
import Footer from '../../components/Footer/Footer'; 
import BottomNav from '../../components/BottomNav/BottomNav'; 

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      
      {/* 1. Header Tetap di Atas */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* 2. Area Konten Utama */}
      <main className='flex-1 w-full max-w-[1920px] mx-auto'>
        {children || <Outlet />}
      </main>
      
      {/* 3. Footer (Akan muncul di paling bawah konten) */}
      <Footer />

      {/* 4. Ruang Kosong agar Footer tidak tertutup BottomNav di HP */}
      <div className="h-20 md:hidden"></div>

      {/* 5. Navigasi Bawah Khusus Mobile */}
      <BottomNav />
      
    </div>
  );
}