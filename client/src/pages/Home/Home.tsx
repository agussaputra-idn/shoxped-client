import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Arahkan ke halaman ProductList (yang ada di /search)
    navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className='container mx-auto max-w-5xl py-20 px-4'>
      {/* 1. Hero Section */}
      <div className='text-center'>
        <h1 className='text-5xl font-bold text-gray-800'>
          Temukan Harga Terbaik
          <br />
          <span className='text-primary'>Shopee</span> vs{' '}
          <span className='text-black'>TikTok Shop</span>
        </h1>
        <p className='mt-6 text-lg text-gray-600'>
          Shoxped adalah agregator pionir di Indonesia.
          <br />
          Cari satu kali, bandingkan di dua platform terbesar.
        </p>
      </div>

      {/* 2. Search Bar Utama */}
      <form
        className='mt-10 flex rounded-lg bg-white p-2 shadow-xl focus-within:ring-2 focus-within:ring-primary'
        onSubmit={handleSearch}
      >
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-grow border-none bg-transparent px-4 py-3 text-lg text-black outline-none'
          placeholder={t('header.searchPlaceholder')}
        />
        <button
          type='submit'
          className='flex-shrink-0 rounded-md bg-primary py-3 px-8 text-lg font-semibold text-white hover:opacity-90'
        >
          Cari
        </button>
      </form>

      {/* 3. Penjelasan Fitur (UPDATED) */}
      <div className='mt-20 grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-800'>1. Cari Produk</h3>
          <p className='mt-2 text-gray-600'>
            Masukkan nama produk apa pun yang Anda inginkan ke dalam kotak pencarian kami.
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-800'>2. Bandingkan</h3>
          <p className='mt-2 text-gray-600'>
            Lihat perbandingan produk (dummy) dari Shopee dan TikTok Shop secara berdampingan.
          </p>
        </div>
        
        {/* === POIN 3 YANG SUDAH DIREVISI === */}
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-800'>3. Dapatkan Harga Terbaik</h3>
          <p className='mt-2 text-gray-600'>
            Pilih penawaran terbaik dari hasil perbandingan dan selesaikan transaksi Anda di Shopee atau TikTok Shop dengan harga termurah.
          </p>
        </div>
        {/* ================================== */}
        
      </div>
    </div>
  );
}