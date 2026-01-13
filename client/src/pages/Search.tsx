import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

// --- SMART FILTER & SORTER ---
const processData = (products: any[], query: string) => {
    if (!query) return products;
    
    const lowerQuery = query.toLowerCase().trim();
    const queryTerms = lowerQuery.split(/\s+/);
    
    // 1. FILTER DULU (Hanya ambil yang relevan)
    let filtered = products.filter(p => {
        const title = p.title.toLowerCase();
        // Cek apakah mengandung kata kunci (Whole Word)
        return queryTerms.every(term => {
            const regex = new RegExp(`\\b${term}`, 'i');
            return regex.test(title);
        });
    });

    // 2. SORTING (URUTKAN PRIORITAS)
    // Produk yang JUDULNYA DIAWALI kata kunci akan naik ke atas
    filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        const aStarts = titleA.startsWith(lowerQuery);
        const bStarts = titleB.startsWith(lowerQuery);

        if (aStarts && !bStarts) return -1; // A menang (Naik ke atas)
        if (!aStarts && bStarts) return 1;  // B menang
        return 0; // Sama kuat
    });

    return filtered;
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const queryName = searchParams.get('q') || searchParams.get('name') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("terkait"); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; 

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            
            const rawData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                
                const price = parseInt(data.price) || 0;
                const isShopeeCheaper = Math.random() < 0.6;
                const variance = Math.random() * 0.2; 
                let tiktokPrice = isShopeeCheaper 
                    ? Math.floor(price * (1 + variance)) 
                    : Math.floor(price * (1 - variance));

                const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
                const keywords = cleanTitle.split(/\s+/).slice(0, 5).join(" ");

                return {
                    id: doc.id,
                    title: data.name || "Produk Tanpa Nama",
                    image: data.image || FALLBACK_IMAGE,
                    shopeePrice: price,
                    tiktokPrice: tiktokPrice,
                    shopeeLink: data.shopeeLink || "#",
                    tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}`,
                    shopeeSearchFallback: `https://shopee.co.id/search?keyword=${encodeURIComponent(keywords)}`,
                    sales: data.sold || data.Sales || "Terlaris",
                    // Nama toko kita hapus dari tampilan, tapi datanya tetap disimpan kalau butuh
                    shopName: data['Nama Toko'] || data.shopName || "", 
                    category: data.category || "Umum"
                };
            });

            // Jalankan Filter & Sorting Prioritas
            const processed = processData(rawData, queryName);
            setProducts(processed);
            setCurrentPage(1); 

        } catch (error) { 
            console.error("Gagal ambil data:", error); 
        } finally { 
            setLoading(false); 
        }
    };
    
    fetchData();
  }, [queryName]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const getSortedProducts = () => {
      let sorted = [...products]; 
      // Jika user memilih sorting harga, prioritas "Nama" diabaikan
      if (sortOption === "termurah") {
          sorted.sort((a, b) => a.shopeePrice - b.shopeePrice);
      } else if (sortOption === "termahal") {
          sorted.sort((a, b) => b.shopeePrice - a.shopeePrice);
      }
      // Jika "Terkait", urutan tetap ikut logika processData (Tas di atas)
      return sorted;
  };

  const sortedProducts = getSortedProducts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 pb-12 pt-4'>
      <div className='w-full max-w-[1200px] mx-auto px-4 md:px-6'>
        
        {/* HEADER */}
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <div>
                <h1 className='text-lg md:text-xl font-bold text-gray-800'>
                    {queryName ? (
                        <>Hasil pencarian: <span className="text-[#ee4d2d]">"{queryName}"</span></>
                    ) : (
                        <>Semua Produk</>
                    )}
                </h1>
                <span className="text-gray-500 text-xs md:text-sm">Ditemukan {products.length} barang</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-gray-600 font-medium">Urutkan:</span>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-xs md:text-sm rounded focus:ring-[#ee4d2d] focus:border-[#ee4d2d] block p-2 cursor-pointer outline-none"
                >
                    <option value="terkait">Terkait</option>
                    <option value="termurah">Harga Termurah</option>
                    <option value="termahal">Harga Termahal</option>
                </select>
            </div>
        </div>

        {/* GRID PRODUK */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 min-h-[500px]'>
            {loading ? (
                 [...Array(10)].map((_, i) => <div key={i} className='bg-white rounded shadow-sm h-96 animate-pulse border border-gray-100' />)
            ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                    <div key={item.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col'>
                        
                        {/* Gambar Produk */}
                        <div className='w-full aspect-square relative overflow-hidden bg-gray-50'>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' 
                                onError={(e: any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} 
                            />
                            {/* Star+ Only */}
                            <div className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[10px] font-bold px-2 py-1 rounded-br shadow-sm">
                                Star+
                            </div>
                        </div>
                        
                        {/* Detail Produk */}
                        <div className='p-4 flex flex-col flex-grow justify-between'>
                            <div>
                                <h3 className='text-xs md:text-sm text-gray-800 font-semibold line-clamp-2 leading-relaxed mb-2' title={item.title}>{item.title}</h3>
                                
                                {/* Info Terjual (Nama Toko DIHAPUS) */}
                                <div className="flex items-center gap-1 mb-3 text-[10px] text-gray-500">
                                    <span>🔥 {item.sales}</span>
                                </div>
                            </div>

                            {/* Harga */}
                            <div className="space-y-1 mb-4">
                                <div className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="font-bold text-[#ee4d2d]">Shopee</span>
                                    <span className="font-bold text-[#ee4d2d]">{formatRupiah(item.shopeePrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="font-medium text-gray-600">TikTok</span>
                                    <span className="font-medium text-gray-600">{formatRupiah(item.tiktokPrice)}</span>
                                </div>
                            </div>

                            {/* Tombol Aksi (UPDATE DESAIN KALEM) */}
                            <div className="flex flex-col gap-2 mt-auto">
                                <div className="flex flex-col md:flex-row gap-2">
                                    {/* Tombol Shopee: Border Orange Pudar (border-orange-200) */}
                                    <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                                    className="flex-1 bg-white text-[#ee4d2d] border border-orange-200 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-orange-50 hover:border-[#ee4d2d] hover:shadow-sm">
                                        Beli di Shopee
                                    </a>
                                    {/* Tombol TikTok: Border Abu (border-gray-300) */}
                                    <a href={item.tiktokLink} target="_blank" rel="noreferrer" 
                                    className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-gray-50 hover:border-gray-800 hover:shadow-sm">
                                        Beli di TikTok
                                    </a>
                                </div>
                                <div className="text-center">
                                    <a href={item.shopeeSearchFallback} target="_blank" rel="noreferrer" 
                                       className="text-[10px] text-gray-400 underline hover:text-[#ee4d2d] transition-colors cursor-pointer block mb-1">
                                        Cari Serupa di Shopee
                                    </a>
                                    <p className="text-[9px] text-gray-300 italic">*Harga dapat berubah sewaktu-waktu</p>
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="font-medium">Waduh, produk "{queryName}" tidak ditemukan.</p>
                    <button onClick={() => window.location.href='/'} className="mt-4 text-[#ee4d2d] text-sm font-bold border border-[#ee4d2d] px-4 py-2 rounded hover:bg-orange-50">Kembali ke Beranda</button>
                </div>
            )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 mb-8 flex-wrap">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 text-sm">&lt;</button>
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                         return (
                            <button key={pageNum} onClick={() => paginate(pageNum)} className={`w-8 h-8 text-sm flex items-center justify-center rounded transition-colors ${currentPage === pageNum ? 'bg-[#ee4d2d] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}>{pageNum}</button>
                        );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) { return <span key={pageNum} className="text-gray-300 text-xs">...</span>; }
                    return null;
                })}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 text-sm">&gt;</button>
            </div>
        )}
      </div>
    </div>
  );
}