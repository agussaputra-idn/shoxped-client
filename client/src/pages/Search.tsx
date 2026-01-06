import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAsYy9QTAN06pTw9fUSu3eIqf9dBUSIS7OQ62aOvxgHLe_9oNzF1CL7BB9T35dd8v8UifG5Nz3rRnX/pub?output=csv";

// --- PARSER SNIPER (TETAP SAMA) ---
const parseCSV = (text: string) => {
    const rows = text.split('\n').filter(row => row && row.trim().length > 0);
    const dataRows = rows.slice(1);

    return dataRows.map((row, index) => {
        const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const cleanParts = parts.map(p => p.trim().replace(/^"|"$/g, '').trim());
        if (cleanParts.length < 2) return null;

        let title = ""; let price = 0; let image = ""; let shopeeLink = "#"; 
        
        const shopeeIndex = cleanParts.findIndex(p => p.toLowerCase().includes('shopee') || p.toLowerCase().includes('shp.ee'));
        if (shopeeIndex > -1) shopeeLink = cleanParts[shopeeIndex];

        const imageIndex = cleanParts.findIndex(p => p.includes('http') && !p.toLowerCase().includes('shopee') && !p.toLowerCase().includes('shp.ee') && (p.includes('img') || p.includes('content') || p.includes('biz') || p.includes('jpg') || p.includes('png')));
        if (imageIndex > -1) image = cleanParts[imageIndex];

        for (let i = 0; i < cleanParts.length; i++) {
            const rawNum = cleanParts[i].replace(/[^0-9]/g, '');
            if (rawNum.length > 3 && !cleanParts[i].includes('http')) { price = parseInt(rawNum); break; }
        }

        if (cleanParts[0] && !cleanParts[0].includes('http') && isNaN(parseInt(cleanParts[0]))) { title = cleanParts[0]; } 
        else { const potentialTitle = cleanParts.find(p => p.length > 10 && !p.includes('http')); title = potentialTitle || "Produk Tanpa Nama"; }

        if (!image) image = "https://via.placeholder.com/300?text=No+Image";
        
        const isShopeeCheaper = Math.random() < 0.6;
        const variance = Math.random() * 0.3; 
        let tiktokPrice = isShopeeCheaper ? Math.floor(price * (1 + variance)) : Math.floor(price * (1 - variance));
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
        const keywords = cleanTitle.split(/\s+/).slice(0, 5).join(" ");

        return {
            id: index + 5000,
            title,
            shopeePrice: price,
            image,
            shopeeLink, 
            tiktokPrice,
            tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}`, 
        };
    }).filter(item => item !== null && item.shopeePrice > 0); 
};

// --- SMART FILTER ---
const smartFilter = (products: any[], query: string) => {
    if (!query) return products;
    const queryTerms = query.toLowerCase().trim().split(/\s+/);
    return products.filter(p => {
        const cleanTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, ' '); 
        const titleWords = cleanTitle.split(/\s+/);
        return queryTerms.every(term => titleWords.includes(term));
    });
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const queryName = searchParams.get('name') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIG PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 30 Produk per halaman

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            const text = await response.text();
            const parsedData = parseCSV(text);
            const filtered = smartFilter(parsedData, queryName);
            setProducts(filtered);
            setCurrentPage(1); // Reset halaman saat search baru
        } catch (error) { console.error("Error:", error); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, [queryName]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // LOGIKA SLICING DATA (PAGINATION)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas saat ganti halaman
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 pb-12'>
      <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 pt-8'>
        
        {/* Header Hasil */}
        <div className='flex items-center justify-between mb-6'>
            <h1 className='text-xl md:text-2xl font-bold text-gray-800'>Hasil: <span className="text-[#ee4d2d]">"{queryName}"</span></h1>
            <span className="text-gray-500 text-sm">Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, products.length)} dari {products.length} Produk</span>
        </div>

        {/* Grid Produk */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 min-h-[500px]'>
            {loading ? (
                 [...Array(10)].map((_, i) => <div key={i} className='bg-white rounded-xl shadow-sm h-80 animate-pulse border border-gray-100' />)
            ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                    <div key={item.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col'>
                        <div className='w-full aspect-square relative overflow-hidden bg-gray-100'>
                            <img src={item.image} alt={item.title} className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} />
                        </div>
                        
                        <div className='p-4 flex flex-col flex-grow justify-between'>
                            <h3 className='text-sm text-gray-800 font-semibold line-clamp-2 leading-snug mb-3' title={item.title}>{item.title}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="font-bold text-[#ee4d2d]">Shopee</span>
                                    <span className="font-bold text-[#ee4d2d]">{formatRupiah(item.shopeePrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="font-medium text-gray-600">TikTok</span>
                                    <span className="font-medium text-gray-600">{formatRupiah(item.tiktokPrice)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-2 mt-auto">
                                <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                                   className="flex-1 bg-white text-[#ee4d2d] border border-[#ee4d2d] text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-[#ee4d2d] hover:text-white hover:shadow-md">
                                    Beli di Shopee
                                </a>
                                <a href={item.tiktokLink} target="_blank" rel="noreferrer" 
                                   className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-black hover:text-white hover:border-black hover:shadow-md">
                                    Beli di TikTok
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-gray-500"><p>Produk tidak ditemukan.</p></div>
            )}
        </div>

        {/* --- NAVIGASI HALAMAN (PAGINATION) --- */}
        {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                {/* Prev */}
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"> &lt; </button>
                
                {/* Numbers */}
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return <button key={page} onClick={() => paginate(page)} className={`w-9 h-9 rounded-md font-bold ${currentPage === page ? 'bg-[#ee4d2d] text-white' : 'bg-white border hover:bg-gray-50'}`}>{page}</button>;
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page}>...</span>;
                    }
                    return null;
                })}

                {/* Next */}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"> &gt; </button>
            </div>
        )}
      </div>
    </div>
  );
}