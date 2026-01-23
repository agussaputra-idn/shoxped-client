import React from 'react';

export default function Terms() {
  return (
    <div className='container mx-auto max-w-4xl py-10 px-4'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Syarat & Ketentuan Penggunaan</h1>
      
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p className="text-sm text-gray-500">Terakhir diperbarui: 24 Januari 2026</p>

        <p>
          Selamat datang di Shoxped.com. Dengan mengakses dan menggunakan website ini, 
          Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. 
          Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
        </p>
        
        <h2 className='text-xl font-semibold text-gray-800 mt-4'>1. Definisi Layanan</h2>
        <p>
          Shoxped beroperasi sebagai <strong>Agregator Informasi Produk</strong> dan <strong>Mesin Pencari (Search Engine)</strong>. 
          Layanan utama kami adalah menampilkan, membandingkan, dan mengarahkan pengguna ke produk yang dijual 
          di marketplace pihak ketiga (seperti Shopee dan TikTok Shop).
        </p>
        <p>
          Kami menegaskan bahwa Shoxped <strong>BUKAN</strong> toko online, pengecer, atau distributor. 
          Kami tidak memiliki inventaris, tidak memproses pembayaran, dan tidak menangani pengiriman barang.
        </p>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>2. Transaksi & Hubungan Pihak Ketiga</h2>
        <p>
          Segala transaksi pembelian yang terjadi setelah Anda mengklik tautan di Shoxped adalah hubungan hukum 
          eksklusif antara <strong>Anda (Pembeli)</strong> dan <strong>Penjual (Merchant)</strong> di marketplace tujuan.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Shoxped tidak bertanggung jawab atas kualitas, keamanan, atau legalitas barang yang diiklankan.</li>
          <li>Shoxped tidak bertanggung jawab atas kegagalan pengiriman atau kesalahan transaksi.</li>
          <li>Segala komplain, retur, atau <em>refund</em> wajib ditujukan langsung ke Customer Service marketplace terkait.</li>
        </ul>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>3. Akurasi Informasi & Harga</h2>
        <p>
          Kami berupaya keras menyajikan data harga dan stok secara <em>real-time</em>. Namun, kami tidak dapat menjamin 
          akurasi 100% setiap saat dikarenakan dinamika perubahan harga oleh penjual di marketplace asal.
        </p>
        <p>
          <strong>Aturan Utama:</strong> Jika terdapat perbedaan harga antara yang tertera di Shoxped dan di halaman Marketplace, 
          maka harga yang sah dan berlaku adalah <strong>harga yang tertera di Marketplace pada saat checkout</strong>.
        </p>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>4. Hak Kekayaan Intelektual</h2>
        <p>
          Seluruh konten visual produk, merek dagang, dan logo marketplace yang ditampilkan di website ini adalah 
          milik pemegang hak cipta masing-masing (Seller/Brand/Platform). Shoxped menggunakannya semata-mata 
          untuk tujuan identifikasi dan promosi (Fair Use).
        </p>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>5. Perubahan Ketentuan</h2>
        <p>
          Kami berhak untuk mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. 
          Penggunaan berkelanjutan Anda atas situs ini setelah perubahan tersebut dianggap sebagai persetujuan Anda.
        </p>
      </div>
    </div>
  );
}