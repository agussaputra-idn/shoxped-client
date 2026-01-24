import React, { useState, useEffect } from 'react'; 
import Carousel from '../../components/Carousel/Carousel'; 
import VideoFeed from '../../components/VideoFeed'; 
import ShareButton from '../../components/ShareButton'; 
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

// --- [BARU] IMPORT WISHLIST HOOK & ICON ---
import { useWishlist } from '../../context/WishlistContext'; 
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'; 
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'; 

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

// Fungsi Acak
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]); // Data Grid Utama (FULL)
  const [videoFeedData, setVideoFeedData] = useState<any[]>([]); // Data Video Feed (SLICE)
  const [carouselData, setCarouselData] = useState<any[]>([]); // Data Carousel (SLICE)
  
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [refreshKey, setRefreshKey] = useState(0);

  // --- [BARU] PANGGIL FUNGSI WISHLIST DARI CONTEXT ---
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Pagination
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isPaginationMode, setIsPaginationMode] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; 
  
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState({ opacity: 1, transition: 'opacity 0.5s ease-in-out' });
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) setDeviceType('android');
    else if (/iPad|iPhone|iPod/.test(userAgent)) setDeviceType('ios');
    else setDeviceType('desktop');
  }, []);

  const categories = [ "Semua", "Fashion Pria", "Fashion Wanita", "Sepatu", "Tas", "Elektronik", "Kecantikan", "Rumah Tangga", "Ibu & Bayi", "Otomotif", "Hobi & Koleksi" ];

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

  // === FETCH DATA (LOGIKA TETAP SAMA SEPERTI SEBELUMNYA) ===
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
            const androidIntent = `intent://search?keyword=${encodedKeywords}&q=${encodedKeywords}&enter_from=search_result#Intent;scheme=tiktok;package=com.ss.android.ugc.trill;S.browser_fallback_url=${encodedWebLink};end`;
            const iosDeepLink = `tiktok://search?keyword=${encodedKeywords}&enter_from=search_result`;

            let salesCount = 0;
            let salesStr = String(data.sold || data.Sales || "0").toUpperCase().trim().replace(/\s/g, '');
            const match = salesStr.match(/(\d+[.,]?\d*)(RB|K|JT|M|JUTA)?/);
            if (match) {
                let numberPart = parseFloat(match[1].replace(',', '.'));
                let unitPart = match[2];
                if (unitPart === 'RB' || unitPart === 'K') { salesCount = numberPart * 1000; } 
                else if (unitPart === 'JT' || unitPart === 'JUTA' || unitPart === 'M') { salesCount = numberPart * 1000000; } 
                else { 
                   let cleanNumStr = salesStr.replace(/\./g, "").replace(/,/g, ""); 
                   salesCount = parseInt(cleanNumStr) || 0; 
                }
            }

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
                salesCount: salesCount, // Pastikan property ini ada untuk logika Wishlist
                category: data.category || "Umum"
            };
        });

        // 1. ACAK TOTAL
        const shuffled = shuffleArray([...rawData]);

        // 2. BAGI JATAH (LOGIKA SAMA)
        setCarouselData(shuffled.slice(0, 5));
        setVideoFeedData(shuffled.slice(5, 20));
        setProducts(shuffled); // Grid pakai semua data (ditimpa, bukan dislice, sesuai request sebelumnya biar aman)
        
        setRefreshKey(Date.now()); 

      } catch (error) { console.error("Gagal ambil data:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeCategory === "Semua") return true;
    const keywords = getKeywordsForCategory(activeCategory);
    const titleLower = p.title.toLowerCase();
    if (keywords.length > 0) {
        return keywords.some(key => titleLower.includes(key));
    }
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  useEffect(() => {
    if ((deviceType === 'android' || deviceType === 'ios') && !isPaginationMode) {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setVisibleCount(prev => prev + 10); 
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [deviceType, isPaginationMode]);

  const handleCategoryChange = (cat: string) => {
      setActiveCategory(cat);
      setVisibleCount(20);
      setIsPaginationMode(false);
      setCurrentPage(1);
  };

  let currentItems = [];
  if (isPaginationMode) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  } else {
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
        
        {/* CAROUSEL & VIDEO FEED */}
        <div className="mt-4 flex flex-col gap-6 mb-6">
            <div className='w-full rounded-xl overflow-hidden shadow-sm'>
                <Carousel key={`carousel-${refreshKey}`} featuredProducts={carouselData} />
            </div>
            
            <div className="w-full">
                <VideoFeed featuredProducts={videoFeedData} />
            </div>
        </div>

        {/* GRID PRODUK */}
        <div id="product-grid-start" className="flex items-center gap-2 mb-4 px-2 pt-2">
            <span className="text-xl animate-bounce">🎁</span>
            <h2 className="font-bold text-gray-800 text-lg">Rekomendasi Untukmu</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 px-1 no-scrollbar">
            {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
            ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 min-h-[500px]">
            {loading ? ([...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />)) : currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                    const isLastAndOdd = index === currentItems.length - 1 && currentItems.length % 2 !== 0;

                    return (
                        <div key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${isLastAndOdd ? 'col-span-full' : ''}`}>
                            <div className={`w-full relative overflow-hidden bg-gray-50 ${isLastAndOdd ? 'aspect-video' : 'aspect-square'}`}>
                                <img src={item.image} alt={item.title} className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' onError={(e: any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} />
                                
                                {/* --- [BARU] TOMBOL WISHLIST DI SINI --- */}
                                {/* Saya pindahkan badge 'Laris' ke KIRI, dan tombol Love di KANAN biar rapi */}
                                
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // Biar gak kebuka link produknya
                                        if (isInWishlist(item.id)) {
                                            removeFromWishlist(item.id);
                                        } else {
                                            addToWishlist(item);
                                        }
                                    }}
                                    className="absolute top-2 right-2 z-20 bg-white/90 p-1.5 rounded-full hover:bg-white shadow-sm transition-all active:scale-90"
                                    title={isInWishlist(item.id) ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
                                >
                                    {isInWishlist(item.id) ? (
                                        <HeartSolid className="w-5 h-5 text-[#ee4d2d]" />
                                    ) : (
                                        <HeartOutline className="w-5 h-5 text-gray-400 hover:text-[#ee4d2d]" />
                                    )}
                                </button>

                                {item.salesCount >= 1000 && (
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                        Laris 🔥
                                    </div>
                                )}
                                {/* -------------------------------------- */}

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
                                        <a href={item.shopeeLink} target="_blank" rel="noreferrer" 
                                           className="flex-1 bg-white text-[#ee4d2d] border border-orange-200 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all 
                                           hover:bg-orange-50 hover:border-[#ee4d2d] hover:shadow-sm active:scale-95">
                                            Beli di Shopee
                                        </a>
                                        <a 
                                            href={deviceType === 'desktop' ? item.finalTikTokLink : "#"}
                                            onClick={(e) => handleTikTokClick(e, item)}
                                            target={deviceType === 'desktop' ? "_blank" : "_self"}
                                            rel="noreferrer" 
                                            className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all 
                                            hover:bg-gray-50 hover:border-gray-800 hover:shadow-sm active:scale-95"
                                        >
                                            Beli di TikTok
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : <div className="col-span-full py-10 text-center text-gray-400 text-sm">Yah, kategori ini kosong. Coba kategori lain!</div>}
        </div>

        {!loading && (
            <div className="mt-8 mb-8 text-center flex flex-col items-center gap-4">
                {!isPaginationMode && visibleCount < filteredProducts.length && (
                    <button onClick={() => setVisibleCount(prev => prev + 20)} className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-gray-50 transition-all active:scale-95 text-sm">Lihat Lainnya ⬇</button>
                )}
                {deviceType === 'desktop' && totalPages > 1 && (
                     <div className="flex justify-center items-center gap-2 mt-4 flex-wrap border-t border-gray-100 pt-6 w-full">
                        <button onClick={() => { setIsPaginationMode(true); setCurrentPage(prev => Math.max(prev - 1, 1)); document.getElementById('product-grid-start')?.scrollIntoView(); }} disabled={currentPage === 1 && isPaginationMode} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white text-xs">&lt;</button>
                        <span className="text-xs text-gray-400">Halaman {currentPage} dari {totalPages}</span>
                        <button onClick={() => { setIsPaginationMode(true); setCurrentPage(prev => Math.min(prev + 1, totalPages)); document.getElementById('product-grid-start')?.scrollIntoView(); }} disabled={currentPage === totalPages && isPaginationMode} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-white text-xs">&gt;</button>
                    </div>
                )}
            </div>
        )}
        
        <div className="text-center mb-4">
             <p className="text-[10px] text-gray-300">Shoxped v8.7 - Wishlist Feature Added</p>
        </div>

      <ShareButton />
      </div>
    </div>
  );
}