import React from 'react';
// PERBAIKAN DI SINI: Menambahkan /Header
import Header from '../../components/Header/Header';       
import Footer from '../../components/Footer/Footer'; 
import { Outlet } from 'react-router-dom';

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen'>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <Header />
      </div>

      <div className='flex-1'>
        {children || <Outlet />}
      </div>
      
      <Footer />
    </div>
  );
}