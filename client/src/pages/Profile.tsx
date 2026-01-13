import React from 'react';

export default function Profile() {
  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50 pb-20">
       <div className="bg-gradient-to-r from-[#ee4d2d] to-orange-500 p-6 rounded-xl text-white mb-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold">Halo, Sultan! 👋</h1>
            <p className="opacity-90 text-sm mt-1">Member Platinum</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-9xl opacity-20">👑</div>
       </div>

       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between">
            <span>📦 Pesanan Saya</span>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between">
            <span>🎟️ Voucher Saya</span>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between">
            <span>⚙️ Pengaturan Akun</span>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="p-4 text-red-500 font-bold hover:bg-red-50 cursor-pointer text-center">
            Keluar
          </div>
       </div>
    </div>
  );
}