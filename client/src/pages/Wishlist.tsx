import React from 'react';

export default function Wishlist() {
  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50 text-center flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">❤️</div>
      <h2 className="font-bold text-xl text-gray-800">Wishlist Kamu</h2>
      <p className="text-gray-500 mt-2">Simpan barang impianmu di sini.</p>
      <button onClick={() => window.history.back()} className="mt-6 text-sm text-gray-400 hover:text-orange-500 underline">Kembali</button>
    </div>
  );
}