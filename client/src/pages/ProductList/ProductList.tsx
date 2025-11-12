import { useProducts } from 'src/hooks/useProducts';
import Product from 'src/components/Product/Product';

export default function ProductList() {
  const { data: productsData, isLoading } = useProducts({});
  
  // Path yang benar ke data dummy (berbaris)
  const productRows = productsData?.data?.productRows;

  return (
    <div className='bg-neutral-100 py-10'>
      <div className='container'>
        {/* Kolom Produk Utama (lebar penuh) */}
        <div className='col-span-12'>
          
          {isLoading && (
            <div className='mt-6 text-center text-lg'>Loading...</div>
          )}
          
          {/* --- TAMPILAN BERBARIS (DENGAN KATEGORI) --- */}
          {!isLoading && productRows && (
            // 1. Loop setiap "Baris Produk" (Flash Sale, Terlaris, dll)
            <div className='flex flex-col gap-8'>
              {productRows.map((row) => (
                <div key={row.rowCategory} className='w-full'>
                  
                  {/* Tampilkan Judul Kategori Baris */}
                  <h2 className='mb-4 text-2xl font-bold uppercase text-gray-800'>
                    {row.rowCategory}
                  </h2>
                  
                  {/* Grid 3 Kolom untuk Perbandingan Produk */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    
                    {/* 2. Loop setiap "Pasangan Produk" di baris itu */}
                    {row.pairs.map((pair) => (
                      // Setiap 'pair' adalah 1 blok perbandingan
                      <div key={pair.id} className='flex flex-col rounded-lg bg-white p-4 shadow-sm'>
                        <h3 className='mb-3 text-base font-semibold text-gray-800 line-clamp-2 min-h-[48px]'>
                          {pair.conceptName}
                        </h3>
                        
                        {/* Grid 2 Kolom (Berdampingan) untuk S vs T */}
                        <div className='grid flex-1 grid-cols-2 gap-4'>
                          <Product product={pair.shopeeVariant} />
                          <Product product={pair.tiktokVariant} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !productRows && (
            <div className='mt-6 text-center text-lg'>
              Tidak ada produk ditemukan.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}