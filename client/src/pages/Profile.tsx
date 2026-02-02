// src/pages/Profile.tsx
import React from 'react';

export default function Profile() {
  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50 pb-20">
       {/* HEADER KARTU SULTAN */}
       <div className="bg-gradient-to-br from-[#ee4d2d] via-[#f56a3f] to-orange-500 p-8 rounded-3xl text-white mb-8 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border border-white/30">
                  👤
               </div>
               <div>
                  <h1 className="text-2xl font-bold">Halo, Sultan! 👋</h1>
                  <p className="bg-white/20 inline-block px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mt-1">
                     👑 Member Platinum
                  </p>
               </div>
            </div>
            
            <div className="flex justify-between items-end mt-4">
               <div>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Total Penghematan</p>
                  <p className="text-xl font-bold">Rp1.250.000</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Koin Sultan</p>
                  <p className="text-xl font-bold">850 ⭐</p>
               </div>
            </div>
          </div>
          
          {/* ORNAMEN MAHKOTA BACKGROUND */}
          <div className="absolute -right-6 -bottom-8 text-[180px] opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
             👑
          </div>
       </div>

       {/* MENU LIST */}
       <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer flex items-center gap-3 group transition-all">
            <span className="bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">📦</span>
            <div className="flex-1">
               <p className="text-sm font-semibold text-gray-800">Pesanan Saya</p>
               <p className="text-[10px] text-gray-400">Cek status pengiriman barangmu</p>
            </div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">&gt;</span>
          </div>

          <div className="p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer flex items-center gap-3 group transition-all">
            <span className="bg-yellow-50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🎟️</span>
            <div className="flex-1">
               <p className="text-sm font-semibold text-gray-800">Voucher Saya</p>
               <p className="text-[10px] text-gray-400">Ada 5 voucher yang bisa kamu pakai</p>
            </div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">&gt;</span>
          </div>

          <div className="p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer flex items-center gap-3 group transition-all">
            <span className="bg-green-50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">⚙️</span>
            <div className="flex-1">
               <p className="text-sm font-semibold text-gray-800">Pengaturan Akun</p>
               <p className="text-[10px] text-gray-400">Keamanan & alamat pengiriman</p>
            </div>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">&gt;</span>
          </div>

          <div className="p-5 text-red-500 font-bold hover:bg-red-50 active:bg-red-100 cursor-pointer text-center text-sm transition-colors mt-2">
            Keluar Akun
          </div>
       </div>

       {/* VERSI APP */}
       <p className="text-center text-[10px] text-gray-300 mt-8 uppercase tracking-widest">
          Shoxped v1.0.4 Beta
       </p>
    </div>
  );
}