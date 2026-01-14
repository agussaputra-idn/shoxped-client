import React, { useState, useEffect } from 'react'; 
import Carousel from '../../components/Carousel/Carousel'; 
import VideoFeed from '../../components/VideoFeed'; 
import ShareButton from '../../components/ShareButton'; 
import { db } from '../../firebase'; 
import { doc, updateDoc, increment, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  // STATE HEADER TEKS
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState({ opacity: 1, transition: 'opacity 0.5s ease-in-out' });

  const categories = ["Semua", "Fashion", "Sepatu", "Tas", "Elektronik", "Kecantikan", "Lainnya"];

  const taglines = [
    { text: "Cek Dulu Disini. Shopee atau TikTok yang Lebih Murah?", highlight: ["Shopee", "TikTok"] },
    { text: "Temukan Harga Terbaik, Shopee VS TikTok Shop!", highlight: ["Shopee VS TikTok Shop", "Shoxped"] },
    { text: "Cari Produk Murah? Bandingkan Aja Disini.", highlight: ["Anti Boncos", "1 Detik"] },
    { text: "Jangan Asal Checkout! Pastikan Dapat Harga Terendah.", highlight: ["Asal Checkout", "Harga Terendah"] },
    { text: "Satu Website, Dua Marketplace. Belanja Jadi Cerdas.", highlight: ["Satu Website", "Cerdas"] }
  ];

  useEffect(() => {
    const timeout = setInterval(() => {
        setFadeProp({ opacity: 0, transition: 'opacity 0.5s ease-in-out' });
        setTimeout(() => {
            setTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
            setFadeProp({ opacity: 1, transition: 'opacity 0.5s ease-in-out' });
        }, 500);
    }, 4000);
    return () => clearInterval(timeout);
  }, []);

  useEffect(() => {
    const logVisit = async () => {
        try {
            const docRef = doc(db, "analytics", "page_views");
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) await setDoc(docRef, { views: 1 });
            else await updateDoc(docRef, { views: increment(1) });
        } catch (e) { console.log("Silent Error:", e); }
    };
    logVisit();
  }, []);

  // FETCH DATA
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
                category: data.category || "Umum"
            };
        });

        const shuffled = rawData.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // PAGINATION LOGIC
  const filteredProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const renderTagline = () => {
    const current = taglines[taglineIndex];
    const parts = current.text.split(new RegExp(`(${current.highlight.join('|')})`, 'gi'));
    return (
        <span style={fadeProp} className="block">
            {parts.map((part, i) => {
                const isHighlight = current.highlight.some(h => h.toLowerCase() === part.toLowerCase());
                return isHighlight 
                    ? <span key={i} className="text-[#ee4d2d] font-bold">{part}</span> 
                    : <span key={i} className="text-gray-700 font-medium">{part}</span>;
            })}
        </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-12">
      
      {/* HEADER */}
      <div className="w-full py-2.5 px-2 bg-white border-b border-orange-100 shadow-sm z-10 flex items-center justify-center overflow-hidden">
        <p className="text-center text-xs md:text-sm leading-snug">
            {renderTagline()}
        </p>
      </div>

      <div className='w-full max-w-[1200px] mx-auto px-2 md:px-6'>
        
        {/* BANNER & VIDEO */}
        <div className="mt-4 flex flex-col gap-4 mb-6">
            <div className='w-full rounded-xl overflow-hidden shadow-sm'>
                {/* PERBAIKAN: Ubah slice(0, 5) menjadi slice(0, 4) agar GENAP & RAPI */}
                <Carousel featuredProducts={products.slice(0, 4)} />
            </div>
            <div className="w-full">
                 <VideoFeed />
            </div>
        </div>

        {/* JUDUL */}
        <div id="product-grid-start" className="flex items-center gap-2 mb-4 px-2 pt-2">
            <span className="text-xl animate-pulse">🔥</span>
            <h2 className="font-bold text-gray-800 text-lg">Lagi Trending</h2>
        </div>

        {/* TAB KATEGORI */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 px-1 no-scrollbar">
            {categories.map((cat) => (
                <button 
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCurrentPage(1); }} 
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        activeCategory === cat 
                        ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* GRID PRODUK - MAIN */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 min-h-[500px]">
            {loading ? (
                [...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />)
            ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                    // LOGIKA ANTI BOLONG: Produk terakhir ganjil akan full width
                    const isLastAndOdd = index === currentItems.length - 1 && currentItems.length % 2 !== 0;

                    return (
                        <div 
                            key={item.id} 
                            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${isLastAndOdd ? 'col-span-full' : ''}`}
                        >
                            <div className={`w-full relative overflow-hidden bg-gray-50 ${isLastAndOdd ? 'aspect-video' : 'aspect-square'}`}>
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' 
                                    onError={(e: any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} 
                                />
                            </div>
                            
                            <div className='p-3 md:p-4 flex flex-col flex-grow justify-between'>
                                <div>
                                    <h3 className='text-xs md:text-sm text-gray-800 font-semibold line-clamp-2 leading-relaxed mb-2' title={item.title}>
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-3 text-[10px] text-gray-500">
                                        <span>🔥 {item.sales}</span>
                                    </div>
                                </div>
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
                                <div className="flex flex-col gap-2 mt-auto">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                                        className="flex-1 bg-white text-[#ee4d2d] border border-orange-200 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-orange-50 hover:border-[#ee4d2d] hover:shadow-sm">
                                            Beli di Shopee
                                        </a>
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
                    );
                })
            ) : (
                <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                    Belum ada produk untuk kategori ini.
                </div>
            )}
        </div>

        {/* INDIKATOR VERSI - SAYA GANTI JADI v1.2 */}
        <div className="mt-8 mb-4 text-center">
             <p className="text-[10px] text-gray-300">Shoxped v1.2 - Layout Fix (4 Items)</p>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-2 mb-8 flex-wrap">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 bg-transparent transition-all">
                    &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                         return (
                            <button key={pageNum} onClick={() => paginate(pageNum)} className={`w-10 h-10 text-sm font-bold flex items-center justify-center rounded-lg transition-all ${currentPage === pageNum ? 'bg-[#ee4d2d] text-white shadow-md transform scale-105' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}>
                                {pageNum}
                            </button>
                        );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) { 
                        return <span key={pageNum} className="text-gray-300">...</span>; 
                    }
                    return null;
                })}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 bg-transparent transition-all">
                    &gt;
                </button>
            </div>
        )}

      <ShareButton />
      </div>
    </div>
  );
}