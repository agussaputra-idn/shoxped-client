import React from 'react';

export default function Terms() {
  return (
    <div className='container mx-auto max-w-4xl py-10 px-4'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Syarat & Ketentuan</h1>
      
      <div className='space-y-4 text-gray-700'>
        <p>Harap baca syarat dan ketentuan ini dengan saksama sebelum menggunakan layanan Shoxped.</p>
        
        <h2 className='text-xl font-semibold mt-4'>1. Penggunaan Layanan</h2>
        <p>Shoxped adalah layanan agregator informasi. Kami menampilkan perbandingan harga dan produk dari berbagai marketplace. Kami bukan penjual barang dan tidak bertanggung jawab atas transaksi, pengiriman, atau kualitas barang yang Anda beli melalui link kami.</p>

        <h2 className='text-xl font-semibold mt-4'>2. Akurasi Informasi</h2>
        <p>Kami berusaha untuk menyediakan informasi yang akurat dan terkini. Namun, harga dan ketersediaan produk dapat berubah sewaktu-waktu di situs penjual aslinya (Shopee/TikTok). Kami tidak menjamin keakuratan informasi secara real-time.</p>

        <h2 className='text-xl font-semibold mt-4'>3. Batasan Tanggung Jawab</h2>
        <p>Shoxped tidak bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan layanan kami atau dari transaksi yang dilakukan dengan pihak ketiga.</p>
      </div>
    </div>
  );
}