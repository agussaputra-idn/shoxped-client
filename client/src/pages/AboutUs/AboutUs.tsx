// Ini adalah halaman statis 'Tentang Kami' Anda
export default function AboutUs() {
  return (
    <div className='container mx-auto max-w-4xl py-10 px-4'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Tentang Shoxped</h1>
      
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p>
          Selamat datang di <strong>Shoxped</strong>! Kami adalah pionir agregator perbandingan harga di Indonesia, 
          yang didedikasikan untuk membantu konsumen cerdas menemukan penawaran terbaik dari marketplace raksasa 
          seperti <strong>Shopee</strong> dan <strong>TikTok Shop</strong> dalam satu platform yang nyaman.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h2 className='text-xl font-bold text-blue-800 mb-2'>Misi Kami</h2>
          <p className="italic">
            "Menyederhanakan pengalaman belanja online dengan transparansi harga. 
            Tidak perlu lagi membuka banyak aplikasi; cukup cari di Shoxped, 
            dan biarkan algoritma kami menemukan harga termurah untuk Anda."
          </p>
        </div>
        
        <h2 className='text-2xl font-semibold text-gray-800 mt-6'>Bagaimana Shoxped Bekerja?</h2>
        <p>
          Shoxped beroperasi sebagai <strong>Mesin Pencari Produk (Search Engine)</strong>. 
          Sistem kami mengumpulkan jutaan data produk secara real-time untuk memudahkan Anda membandingkan harga.
        </p>
        <p>
          Penting untuk diketahui bahwa <strong>Shoxped bukan toko online</strong>. 
          Kami tidak menjual barang, tidak menyimpan stok, dan tidak memproses pembayaran. 
          Ketika Anda mengklik tombol "Beli" atau "Lihat Detail", Anda akan diarahkan langsung ke halaman penjual asli 
          di marketplace terkait untuk menyelesaikan transaksi dengan aman.
        </p>

        <h2 className='text-2xl font-semibold text-gray-800 mt-6'>Transparansi Afiliasi</h2>
        <p>
          Kami bangga menjadi mitra resmi dalam ekosistem pemasaran afiliasi (seperti Shopee Affiliate Program, Accesstrade, dan Involve Asia). 
          Layanan ini 100% GRATIS untuk Anda gunakan. Sebagai gantinya, kami mungkin mendapatkan komisi kecil 
          dari pihak marketplace ketika Anda melakukan pembelian melalui tautan kami, tanpa biaya tambahan bagi Anda.
        </p>
      </div>
    </div>
  );
}