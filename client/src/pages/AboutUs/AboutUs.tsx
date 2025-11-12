// Ini adalah halaman statis 'Tentang Kami' Anda
export default function AboutUs() {
  return (
    <div className='container mx-auto max-w-4xl py-10 px-4'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Tentang Shoxped</h1>
      
      <div className='space-y-4 text-gray-700'>
        <p>
          Selamat datang di Shoxped! Kami adalah agregator perbandingan produk pionir di Indonesia, 
          didedikasikan untuk membantu Anda menemukan penawaran terbaik dari Shopee dan TikTok Shop 
          di satu tempat yang nyaman.
        </p>
        <p>
          Misi kami adalah menyederhanakan pengalaman belanja online Anda. 
          Tidak perlu lagi membuka banyak tab atau aplikasi; cukup cari produk yang Anda inginkan di 
          Shoxped, dan kami akan menampilkan perbandingannya untuk Anda.
        </p>
        
        <h2 className='pt-4 text-2xl font-semibold'>Bagaimana Ini Bekerja?</h2>
        <p>
          Shoxped adalah layanan afiliasi resmi yang bermitra dengan Involve Asia. 
          Kami tidak menjual produk secara langsung. Saat Anda menemukan item yang Anda sukai, 
          kami akan mengarahkan Anda ke Shopee atau TikTok Shop menggunakan link afiliasi yang aman.
        </p>
      </div>
    </div>
  );
}