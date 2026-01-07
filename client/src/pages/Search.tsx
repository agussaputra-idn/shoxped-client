import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAsYy9QTAN06pTw9fUSu3eIqf9dBUSIS7OQ62aOvxgHLe_9oNzF1CL7BB9T35dd8v8UifG5Nz3rRnX/pub?output=csv";

// --- PARSER DATA ---
const parseCSV = (text: string) => {
    const rows = text.split('\n').filter(row => row && row.trim().length > 0);
    const dataRows = rows.slice(1);

    return dataRows.map((row, index) => {
        const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const cleanParts = parts.map(p => p.trim().replace(/^"|"$/g, '').trim());

        if (cleanParts.length < 3) return null;

        const title = cleanParts[0] || "Produk Tanpa Nama";
        const priceRaw = cleanParts[1] ? cleanParts[1].replace(/[^0-9]/g, '') : "0";
        const price = parseInt(priceRaw) || 0;

        let image = cleanParts[2];
        if (!image || !image.includes('http')) image = "https://via.placeholder.com/300?text=No+Image";

        let shopeeLink = "#";
        if (cleanParts[6] && cleanParts[6].includes('http')) shopeeLink = cleanParts[6];
        else {
            const findLink = cleanParts.find(p => p.includes('shopee.co.id') || p.includes('shp.ee'));
            if (findLink) shopeeLink = findLink;
        }

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
            // Tambahan: Link Pencarian Manual Shopee (Backup jika link utama mati)
            shopeeSearchFallback: `https://shopee.co.id/search?keyword=${encodeURIComponent(keywords)}`,
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
  const itemsPerPage = 30; 

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            const text = await response.text();
            const parsedData = parseCSV(text);
            const filtered = smartFilter(parsedData, queryName);
            setProducts(filtered);
            setCurrentPage(1); 
        } catch (error) { console.error("Error:", error); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, [queryName]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 pb-12'>
      <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 pt-8'>
        
        <div className='flex items-center justify-between mb-6'>
            <h1 className='text-xl md:text-2xl font-bold text-gray-800'>Hasil: <span className="text-[#ee4d2d]">"{queryName}"</span></h1>
            <span className="text-gray-500 text-sm">Menampilkan {products.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, products.length)} dari {products.length} Produk</span>
        </div>

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

                            <div className="flex flex-col gap-2 mt-auto">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                                    className="flex-1 bg-white text-[#ee4d2d] border border-[#ee4d2d] text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-[#ee4d2d] hover:text-white hover:shadow-md">
                                        Beli di Shopee
                                    </a>
                                    <a href={item.tiktokLink} target="_blank" rel="noreferrer" 
                                    className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-black hover:text-white hover:border-black hover:shadow-md">
                                        Beli di TikTok
                                    </a>
                                </div>
                                
                                {/* --- FITUR ANTI KECEWA: LINK CADANGAN --- */}
                                <a href={item.shopeeSearchFallback} target="_blank" rel="noreferrer" 
                                   className="text-[10px] text-gray-400 text-center underline hover:text-[#ee4d2d] transition-colors cursor-pointer pt-1">
                                    Link Error? Cari Serupa di Shopee
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-gray-500"><p>Produk tidak ditemukan.</p></div>
            )}
        </div>

        {/* --- PAGINATION --- */}
        {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 bg-white">&lt;</button>
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                         return (
                            <button key={pageNum} onClick={() => paginate(pageNum)} className={`w-10 h-10 rounded-md font-bold transition-colors ${currentPage === pageNum ? 'bg-[#ee4d2d] text-white border border-[#ee4d2d]' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{pageNum}</button>
                        );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) { return <span key={pageNum} className="text-gray-400">...</span>; }
                    return null;
                })}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 bg-white">&gt;</button>
            </div>
        )}

      </div>
    </div>
  );
}