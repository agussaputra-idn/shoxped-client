import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className='container mx-auto max-w-4xl py-10 px-4'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Kebijakan Privasi & Penafian</h1>
      
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p className="text-sm text-gray-500">Terakhir diperbarui: 24 Januari 2026</p>
        
        <p>
          Selamat datang di Shoxped. Privasi dan kepercayaan Anda adalah prioritas utama kami. 
          Halaman ini menjelaskan kebijakan kami mengenai pengumpulan data, penggunaan layanan, 
          dan transparansi afiliasi.
        </p>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className='text-xl font-bold text-yellow-800 mb-2'>1. Penafian Afiliasi (Affiliate Disclosure)</h2>
          <p className="text-sm">
            <strong>Harap diperhatikan:</strong> Shoxped.com berpartisipasi dalam berbagai program pemasaran afiliasi. 
            Artinya, kami dapat memperoleh komisi dari pembelian yang memenuhi syarat melalui tautan di situs kami. 
            <br/><br/>
            Tautan produk yang Anda klik adalah <strong>Tautan Afiliasi</strong>. 
            Meskipun kami mendapatkan komisi, hal ini <strong>TIDAK</strong> memengaruhi harga yang Anda bayar 
            (harga tetap sama atau bahkan lebih murah dengan voucher yang kami sediakan), 
            dan tidak memengaruhi objektivitas kami dalam menampilkan perbandingan harga.
          </p>
        </div>
        
        <h2 className='text-xl font-semibold text-gray-800 mt-4'>2. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami percaya pada privasi total. Oleh karena itu:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kami <strong>TIDAK</strong> mewajibkan pendaftaran akun untuk fitur pencarian.</li>
          <li>Kami <strong>TIDAK</strong> mengumpulkan data pribadi sensitif (seperti Nama, Alamat, No Kartu Kredit).</li>
          <li>Kami hanya mengumpulkan data anonim (seperti jenis browser dan klik tautan) melalui <em>Cookies</em> untuk menganalisis kinerja website.</li>
        </ul>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>3. Link ke Situs Pihak Ketiga</h2>
        <p>
          Layanan kami berisi tautan yang mengarahkan Anda ke marketplace eksternal (Shopee dan TikTok Shop). 
          Harap diingat bahwa situs-situs tersebut memiliki Kebijakan Privasi mereka sendiri yang terpisah dari kami. 
          Kami tidak bertanggung jawab atas konten atau praktik privasi di situs pihak ketiga tersebut.
        </p>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>4. Keamanan Transaksi</h2>
        <p>
          Shoxped <strong>TIDAK PERNAH</strong> meminta informasi pembayaran Anda. 
          Seluruh proses transaksi, pembayaran, dan pengiriman dilakukan sepenuhnya di platform marketplace tujuan 
          yang sudah terjamin keamanannya.
        </p>

        <h2 className='text-xl font-semibold text-gray-800 mt-4'>5. Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang praktik privasi ini, silakan hubungi tim kami melalui email resmi yang tertera di bagian bawah halaman ini.
        </p>
      </div>
    </div>
  );
}