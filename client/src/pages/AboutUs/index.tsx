import React from 'react';

export default function AboutUs() {
  return (
    <div className='container mx-auto max-w-3xl py-16 px-6'>
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Tentang Shoxped</h1>
        <p className="text-gray-500">Solusi Cerdas Belanja Hemat</p>
      </div>
      
      {/* KONTEN UTAMA */}
      <div className='space-y-8 text-gray-700 leading-relaxed text-justify'>
        <p>
          Selamat datang di <strong>Shoxped</strong>, platform agregator produk inovatif yang dirancang khusus untuk pasar Indonesia. 
          Kami hadir dengan satu misi sederhana: <strong>Membantu Anda menemukan harga termurah tanpa ribet.</strong>
        </p>

        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className='font-bold text-red-600 mb-2 text-lg'>Visi Kami</h3>
          <p className="text-gray-700">
            "Menjadi mesin pencari belanja nomor satu yang menghubungkan konsumen dengan penawaran terbaik dari Shopee dan TikTok Shop dalam satu layar."
          </p>
        </div>

        <div>
          <h3 className='font-bold text-gray-900 text-xl mb-3'>Apa yang Kami Lakukan?</h3>
          <p className="mb-4">
            Shoxped bukan toko online konvensional. Kami adalah <strong>Mesin Pencari (Search Engine)</strong>. 
            Teknologi kami memindai jutaan produk secara real-time untuk membandingkan harga, sehingga Anda tidak perlu lagi 
            membuka-tutup banyak aplikasi hanya untuk mengecek selisih harga Rp 500 perak.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Transparan:</strong> Harga yang Anda lihat adalah harga asli dari penjual.</li>
            <li><strong>Aman:</strong> Transaksi dilakukan langsung di aplikasi resmi marketplace pilihan Anda.</li>
            <li><strong>Lengkap:</strong> Jutaan data produk dari berbagai kategori.</li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-gray-900 text-xl mb-3'>Partner Resmi</h3>
          <p>
            Untuk memastikan validitas data, Shoxped bekerja sama dalam ekosistem afiliasi resmi dengan platform terkemuka seperti 
            **Shopee Affiliate Program**, **TikTok Shop**, dan jaringan **Accesstrade**.
          </p>
        </div>
      </div>

    </div>
  );
}