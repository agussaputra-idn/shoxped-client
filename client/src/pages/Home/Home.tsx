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
  
  // --- STATE BARU UNTUK INFINITE SCROLL ---
  const [visibleCount, setVisibleCount] = useState(20); // Mula-mula tampil 20 produk
  const [isPaginationMode, setIsPaginationMode] = useState(false); // Mode Paging vs Scroll
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // Jika mode paging, 30 per halaman
  
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState({ opacity: 1, transition: 'opacity 0.5s ease-in-out' });
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const categories = [
    "Semua", "Fashion Pria", "Fashion Wanita", "Sepatu", "Tas", "Elektronik", 
    "Kecantikan", "Rumah Tangga", "Ibu & Bayi", "Otomotif", "Hobi & Koleksi"
  ];

  const getKeywordsForCategory = (cat: string) => {
    const map: Record<string, string[]> = {
        "Fashion Pria": ["pria", "cowok", "laki", "kemeja", "kaos", "man", "men", "batik", "jaket", "hoodie", "boxer", "celana panjang", "jeans pria", "chino"],
        "Fashion Wanita": ["wanita", "cewek", "perempuan", "dress", "gamis", "blouse", "rok", "hijab", "tunik", "kulot", "bra", "cd wanita", "kebaya", "daster", "mukena"],
        "Sepatu": ["sepatu", "sneaker", "sandal", "boots", "heels", "wedges", "flat", "pantofel", "kaki", "shoes"],
        "Tas": ["tas", "ransel", "bag", "tote", "sling", "selempang", "dompet", "pouch", "backpack", "carrier", "koper", "waist", "clutch", "shoulder"],
        "Elektronik": ["hp", "handphone", "laptop", "kamera", "speaker", "headset", "charger", "casing", "iphone", "android", "samsung", "xiaomi", "oppo", "vivo", "kabel", "powerbank"],
        "Kecantikan": ["serum", "toner", "lip", "cream", "sunscreen", "masker", "skincare", "bedak", "parfum", "body lotion", "sabun wajah", "facial", "makeup"],
        "Rumah Tangga": ["sprei", "selimut", "bantal", "dapur", "pisau", "rak", "pel", "sapu", "dekorasi", "wajan", "panci", "lampu", "deterjen", "sabun cuci"],
        "Ibu & Bayi": ["popok", "pampers", "susu", "bayi", "baby", "anak", "mainan", "stroller", "gendongan", "botol"],
        "Otomotif": ["helm", "oli", "motor", "mobil", "sarung tangan", "knalpot", "wiper", "ban", "spion"],
        "Hobi & Koleksi": ["buku", "gitar", "pancing", "sepeda", "camping", "tenda", "raket", "bola", "jersey", "mainan", "action figure"]
    };
    return map[cat] || [];
  };

  const taglines = [
    { text: "Cek Dulu Disini. Shopee atau TikTok yang Lebih Murah?", highlight: ["Shopee", "TikTok"] },
    { text: "Temukan Harga Terbaik, Shopee VS TikTok Shop!", highlight: ["Shopee VS TikTok Shop", "Shoxped"] },
    { text: "Cari Produk Murah? Bandingkan Aja Disini.", highlight: ["Anti Boncos", "1 Detik"] }
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const rawData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const price = parseInt(data.price) || 0;
            const isShopeeCheaper = Math.random() < 0.6;
            const variance = Math.random() * 0.2; 
            let tiktokPrice = isShopeeCheaper ? Math.floor(price * (1 + variance)) : Math.floor(price * (1 - variance));
            const cleanTitle = (data.name || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
            const keywords = cleanTitle.split(/\s+/).slice(0, 5).join(" ");
            const encodedKeywords = encodeURIComponent(keywords);
            const webLink = `https://www.tiktok.com/search?q=${encodedKeywords}`;
            const encodedWebLink = encodeURIComponent(webLink);
            const androidIntent = `intent://www.tiktok.com/search?q=${encodedKeywords}#Intent;scheme=https;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodedWebLink};end`;
            const iosDeepLink = `tiktok://search/result?keyword=${encodedKeywords}`;

            return {
                id: doc.id,
                title: data.name || "Produk Tanpa Nama",
                image: data.image || FALLBACK_IMAGE,
                shopeePrice: price,
                tiktokPrice: tiktokPrice,
                shopeeLink: data.shopeeLink || "#",
                finalTikTokLink: webLink,
                androidLink: androidIntent,
                iosLink: iosDeepLink,
                shopeeSearchFallback: `https://shopee.co.id/search?keyword=${encodedKeywords}`,
                sales: data.sold || data.Sales || "Terlaris", 
                category: data.category || "Umum"
            };
        });
        const shuffled = rawData.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (error) { console.error("Gagal ambil data:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(p => {
    if (activeCategory === "Semua") return true;
    const keywords = getKeywordsForCategory(activeCategory);
    const titleLower = p.title.toLowerCase();
    if (keywords.length > 0) {
        return keywords.some(key => titleLower.includes(key));
    }
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // --- INFINITE SCROLL LOGIC (HP) ---
  useEffect(() => {
    // Hanya aktif di HP (Android/iOS) dan jika TIDAK dalam mode pagination
    if ((deviceType === 'android' || deviceType === 'ios') && !isPaginationMode) {
        const handleScroll = () => {
            // Cek apakah user sudah scroll sampai bawah (minus 200px buffer)
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setVisibleCount(prev => prev + 10); // Tambah 10 produk otomatis
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [deviceType, isPaginationMode]);

  // Reset tampilan saat kategori berubah
  const handleCategoryChange = (cat: string) => {
      setActiveCategory(cat);
      setVisibleCount(20);
      setIsPaginationMode(false);
      setCurrentPage(1);
  };

  // --- LOGIC TAMPILAN PRODUK ---
  let currentItems = [];
  if (isPaginationMode) {
      // Mode Halaman (1, 2, 3...) - Biasanya Desktop
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  } else {
      // Mode Scroll / Load More - Default HP & Desktop Awal
      currentItems = filteredProducts.slice(0, visibleCount);
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const renderTagline = () => {
    const current = taglines[taglineIndex];
    const parts = current.text.split(new RegExp(`(${current.highlight.join('|')})`, 'gi'));
    return (
        <span style={fadeProp} className="block">{parts.map((part, i) => {
            const isHighlight = current.highlight.some(h => h.toLowerCase() === part.toLowerCase());
            return isHighlight ? <span key={i} className="text-[#ee4d2d] font-bold">{part}</span> : <span key={i} className="text-gray-700 font-medium">{part}</span>;
        })}</span>
    );
  };

  const handleTikTokClick = (e: React.MouseEvent, item: any) => {
    if (deviceType === 'desktop') return;
    e.preventDefault();
    if (deviceType === 'android') {
        window.location.href = item.androidLink;
    } else if (deviceType === 'ios') {
        window.location.href = item.iosLink;
        setTimeout(() => {
             if (!document.hidden) {
                 window.location.href = item.finalTikTokLink;
             }
        }, 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-12">
      <div className="w-full py-2.5 px-2 bg-white border-b border-orange-100 shadow-sm z-10 flex items-center justify-center overflow-hidden">
        <p className="text-center text-xs md:text-sm leading-snug">{renderTagline()}</p>
      </div>

      <div className='w-full max-w-[1200px] mx-auto px-2 md:px-6'>
        <div className="mt-4 flex flex-col gap-6 mb-6">
            <div className='w-full rounded-xl overflow-hidden shadow-sm'>
                <Carousel featuredProducts={products.slice(0, 5)} />
            </div>
            <div className="w-full"><VideoFeed /></div>
        </div>

        <div id="product-grid-start" className="flex items-center gap-2 mb-4 px-2 pt-2">
            <span className="text-xl animate-pulse">🔥</span><h2 className="font-bold text-gray-800 text-lg">Rekomendasi Pilihan</h2>
        </div>

        {/* TAB KATEGORI */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 px-1 no-scrollbar">
            {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
            ))}
        </div>

        {/* GRID PRODUK */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 min-h-[500px]">
            {loading ? ([...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />)) : currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                    const isLastAndOdd = index === currentItems.length - 1 && currentItems.length % 2 !== 0;

                    return (
                        <div key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${isLastAndOdd ? 'col-span-full' : ''}`}>
                            <div className={`w-full relative overflow-hidden bg-gray-50 ${isLastAndOdd ? 'aspect-video' : 'aspect-square'}`}>
                                <img src={item.image} alt={item.title} className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' onError={(e: any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} />
                            </div>
                            
                            <div className='p-3 md:p-4 flex flex-col flex-grow justify-between'>
                                <div>
                                    <h3 className='text-xs md:text-sm text-gray-800 font-semibold line-clamp-2 leading-relaxed mb-2' title={item.title}>{item.title}</h3>
                                    <div className="flex items-center gap-1 mb-3 text-[10px] text-gray-500"><span>🔥 {item.sales}</span></div>
                                </div>
                                <div className="space-y-1 mb-4">
                                    <div className="flex justify-between items-center text-xs md:text-sm"><span className="font-bold text-[#ee4d2d]">Shopee</span><span className="font-bold text-[#ee4d2d]">{formatRupiah(item.shopeePrice)}</span></div>
                                    <div className="flex justify-between items-center text-xs md:text-sm"><span className="font-medium text-gray-600">TikTok</span><span className="font-medium text-gray-600">{formatRupiah(item.tiktokPrice)}</span></div>
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-auto">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <a href={item.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-white text-[#ee4d2d] border border-orange-200 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-orange-50 hover:border-[#ee4d2d] hover:shadow-sm">Beli di Shopee</a>
                                        <a 
                                            href={deviceType === 'desktop' ? item.finalTikTokLink : "#"}
                                            onClick={(e) => handleTikTokClick(e, item)}
                                            target={deviceType === 'desktop' ? "_blank" : "_self"}
                                            rel="noreferrer" 
                                            className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-gray-50 hover:border-gray-800 hover:shadow-sm"
                                        >
                                            Beli di TikTok
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <a href={item.shopeeSearchFallback} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 underline hover:text-[#ee4d2d] transition-colors cursor-pointer block mb-1">Cari Serupa di Shopee</a>
                                        <p className="text-[9px] text-gray-300 italic">*Harga dapat berubah sewaktu-waktu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : <div className="col-span-full py-10 text-center text-gray-400 text-sm">Yah, produk kategori ini tidak ditemukan.</div>}
        </div>

        {/* --- KONTROL LOAD MORE & PAGINATION --- */}
        {!loading && (
            <div className="mt-8 mb-8 text-center flex flex-col items-center gap-4">
                
                {/* 1. TOMBOL "LIHAT LAINNYA" (Hanya Muncul jika belum habis) */}
                {!isPaginationMode && visibleCount < filteredProducts.length && (
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 20)}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 text-sm"
                    >
                        Lihat Lainnya ⬇
                    </button>
                )}

                {/* 2. PAGINATION (Hanya di Desktop, di bawah tombol Lihat Lainnya) */}
                {deviceType === 'desktop' && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap border-t border-gray-100 pt-6 w-full">
                        <span className="text-xs text-gray-400 w-full mb-2">Atau loncat ke halaman:</span>
                        
                        <button onClick={() => { setIsPaginationMode(true); setCurrentPage(prev => Math.max(prev - 1, 1)); document.getElementById('product-grid-start')?.scrollIntoView(); }} disabled={currentPage === 1 && isPaginationMode} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white text-xs">&lt;</button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Logic agar pagination tidak terlalu panjang
                            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                return (
                                    <button 
                                        key={pageNum} 
                                        onClick={() => { 
                                            setIsPaginationMode(true); 
                                            setCurrentPage(pageNum);
                                            document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
                                        }} 
                                        className={`w-8 h-8 text-xs font-bold flex items-center justify-center rounded transition-all ${isPaginationMode && currentPage === pageNum ? 'bg-[#ee4d2d] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) { return <span key={pageNum} className="text-gray-300 text-xs">...</span>; }
                            return null;
                        })}

                        <button onClick={() => { setIsPaginationMode(true); setCurrentPage(prev => Math.min(prev + 1, totalPages)); document.getElementById('product-grid-start')?.scrollIntoView(); }} disabled={currentPage === totalPages && isPaginationMode} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white text-xs">&gt;</button>
                    </div>
                )}
            </div>
        )}
        
        <div className="text-center mb-4">
             <p className="text-[10px] text-gray-300">Shoxped v5.5 - Infinite Scroll Mobile & Desktop Hybrid</p>
        </div>

      <ShareButton />
      </div>
    </div>
  );
}