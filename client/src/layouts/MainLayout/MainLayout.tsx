import React from 'react';
import Header from '../../components/Header/Header';       
import Footer from '../../components/Footer/Footer'; 
import BottomNav from '../../components/BottomNav/BottomNav'; // 👈 Import ini
import { Outlet } from 'react-router-dom';

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    // Tambahkan 'pb-[70px] md:pb-0' agar konten tidak tertutup Bottom Nav di HP
    <div className='flex flex-col min-h-screen pb-[70px] md:pb-0 bg-gray-50'>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Content Area */}
      <div className='flex-1 w-full max-w-[1920px] mx-auto'>
        {children || <Outlet />}
      </div>
      
      {/* Footer Besar (Hanya muncul di Desktop/Tablet biar di HP gak sempit) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom Navigation (Sticky di Bawah) */}
      <BottomNav />
      
    </div>
  );
}