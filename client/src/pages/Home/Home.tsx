import React, { useState, useEffect, useRef, useCallback } from 'react';
import Carousel from '../../components/Carousel'; 
import VideoFeed from '../../components/VideoFeed'; 
import RacunSection from '../../components/RacunSection';
import { useWishlist } from '../../context/WishlistContext';
import Footer from '../../components/Footer/Footer';

// ----------------------------------------------------------------------
// KOMPONEN ICONS & UI KECIL (TETAP ADA)
// ----------------------------------------------------------------------
const IconBagLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 30H75C77.7614 30 80 32.2386 80 35V80C80 85.5228 75.5228 90 70 90H30C24.4772 90 20 85.5228 20 80V35C20 32.2386 22.2386 30 25 30Z" fill="#ee4d2d"/>
    <path d="M35 30V22C35 13.7157 41.7157 7 50 7C58.2843 7 65 13.7157 65 22V30" stroke="#ee4d2d" strokeWidth="6" strokeLinecap="round"/>
    <path d="M38 55C38 55 42 65 50 65C58 65 62 55 62 55" stroke="white" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);
const IconSearch = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>);
const IconHeartOutline = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>);
const IconHeartSolid = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#ee4d2d]"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>);

const ShareButtonFix = () => {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const shareData = { title: 'Shoxped', text: 'Cek harga termurah Shopee vs TikTok Shop!', url: 'https://shoxped.com' };
    if (navigator.share) { try { await navigator.share(shareData); } catch (err) {} } 
    else { try { await navigator.clipboard.writeText(shareData.url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) {} }
  };
  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {copied && <div className="bg-black text-white text-xs py-1 px-3 rounded-lg shadow-lg mb-1 animate-fade-in">Link Disalin!</div>}
      <button onClick={handleShare} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white p-3.5 rounded-full shadow-xl hover:scale-110 transition-all border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]); // Data Mentah (Backup)
  const [products, setProducts] = useState<any[]>([]);       // Data Tampil
  const [racunData, setRacunData] = useState<any[]>([]); 
  const [carouselData, setCarouselData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [visibleCount, setVisibleCount] = useState(40); 
  const observerTarget = useRef(null); 
  const [hookIndex, setHookIndex] = useState(0);

  const ACCESSTRADE_ID = "002bc7002mjl"; 
  const hooks = ["Cek harga Termurah Shopee vs TikTok Shop dalam satu klik!", "Belanja anti-boncos!", "Shoxped Jalan Ninjamu."];

  // Helper: Pastikan Link Selalu HTTPS (Solusi Localhost)
  const ensureAbsoluteUrl = (url: string) => {
      if (!url) return "";
      let cleanUrl = url.trim();
      if (cleanUrl.startsWith("//")) return "https:" + cleanUrl;
      if (!cleanUrl.startsWith("http")) return "https://" + cleanUrl;
      return cleanUrl;
  };

  // 1. LOGIKA UTAMA: PROSES DATA PRODUK
  const processProducts = useCallback((rawData: any[]) => {
    return rawData.map((data: any) => {
      const rawPrice = data.price || data.Price || "0";
      const basePrice = typeof rawPrice === 'number' ? rawPrice : parseInt(rawPrice.toString().replace(/[^0-9]/g, '')) || 0;
      const productName = data.name || data.Title || "Produk";
      
      let dbLink = data.link || data['Affiliate Link'] || "";
      dbLink = ensureAbsoluteUrl(dbLink); 

      let shopeePrice, tiktokPrice, shopeeLink, tiktokLink;
      
      // Deteksi Sumber Data
      const isTikTokSource = data.platform === 'tiktok' || dbLink.includes('tiktok') || dbLink.includes('vt.tiktok');

      if (isTikTokSource) {
          tiktokPrice = basePrice;
          shopeePrice = Math.floor(basePrice * 0.95); 
          
          tiktokLink = dbLink; // ✅ Link Asli Affiliate TikTok
          
          const searchUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(productName)}`;
          shopeeLink = `https://atid.me/adv.php?rk=${ACCESSTRADE_ID}&url=${encodeURIComponent(searchUrl)}`;
      } else {
          // Sumber Shopee / AccessTrade
          shopeePrice = basePrice;
          tiktokPrice = Math.floor(basePrice * (1.05 + Math.random() * 0.15));
          
          if (dbLink.includes("atid.me")) {
              shopeeLink = dbLink;
          } else {
              shopeeLink = `https://atid.me/adv.php?rk=${ACCESSTRADE_ID}&url=${encodeURIComponent(dbLink)}`;
          }

          // ✅ GENERATE LINK SEARCH TIKTOK (Agar tombol tidak kosong/localhost)
          tiktokLink = `https://www.tiktok.com/search?q=${encodeURIComponent(productName)}`;
      }

      return {
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        title: productName,
        shopeePrice,
        tiktokPrice,
        shopeeLink: ensureAbsoluteUrl(shopeeLink),
        tiktokLink: ensureAbsoluteUrl(tiktokLink),
        sales: data.sales || data.Sales || "Laris"
      };
    });
  }, [ACCESSTRADE_ID]);

  // 2. FETCH DATA DARI FILE JSON (Solusi Build Size)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Pastikan products.json sudah ada di folder public/
        const response = await fetch('/products.json');
        if (!response.ok) throw new Error("Gagal load data");
        const jsonData = await response.json();
        const processed = processProducts(jsonData);
        
        setAllProducts(processed); // Simpan master data
        
        const shuffled = [...processed].sort(() => 0.5 - Math.random());
        setProducts(shuffled);
        setCarouselData(shuffled.slice(0, 5));
        setRacunData(shuffled.slice(0, 10).map((item, idx) => ({...item, platform: idx%2===0?'shopee':'tiktok', price: idx%2===0?item.shopeePrice:item.tiktokPrice})));
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    loadData();
  }, [processProducts]);

  // 3. FILTERING (Search & Category)
  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = allProducts;

    if (activeCategory !== "Semua") {
        filtered = filtered.filter((p: any) => {
            const cat = p.category || p.Category || "";
            if(activeCategory === "Tas Wanita" && cat === "601450") return true;
            return cat === activeCategory; 
        });
    }

    if (query) {
        filtered = filtered.filter((p: any) => (p.name || p.Title || "").toLowerCase().includes(query.toLowerCase()));
    }

    setProducts(filtered);
    setVisibleCount(40);
  }, [query, activeCategory, allProducts]);

  // 4. HANDLE KLIK TIKTOK (Deep Link)
  const handleTikTokBuy = async (e: React.MouseEvent, product: any) => {
    // Mobile logic only
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        e.preventDefault(); e.stopPropagation();
        
        // Cek apakah ini link search hasil generate atau link affiliate asli
        const targetUrl = product.tiktokLink;
        const isSearch = targetUrl.includes('tiktok.com/search');

        if (isSearch) {
            // Logic Deep Link untuk Search
            let cleanTitle = product.title.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().replace(/\s+/g, ' ').split(' ').slice(0, 5).join(' ');
            const queryName = encodeURIComponent(cleanTitle);
            
            window.location.href = `tiktok://search?q=${queryName}`;
            setTimeout(() => { if (!document.hidden) window.location.href = targetUrl; }, 1500);
        } else {
            // Logic Deep Link untuk Direct URL
            window.location.href = targetUrl;
        }
    }
    // Desktop: biarkan <a> tag bekerja (open new tab)
  };

  useEffect(() => { const interval = setInterval(() => { setHookIndex((p) => (p + 1) % hooks.length); }, 4500); return () => clearInterval(interval); }, [hooks.length]);
  useEffect(() => { const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !loading) setVisibleCount((prev) => prev + 40); }, { threshold: 0.1 }); if (observerTarget.current) observer.observe(observerTarget.current); return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); }; }, [loading]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const categories = ["Semua", "Tas Wanita", "Fashion Muslim", "Sepatu Wanita", "Sepatu Pria", "Aksesoris Fashion", "Fashion Bayi & Anak", "Makanan & Minuman", "Pakaian Wanita", "Perawatan & Kecantikan", "Handphone & Aksesoris", "Perlengkapan Rumah"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-[60] bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-4"> 
          <div className="hidden md:flex items-center gap-1 cursor-pointer shrink-0" onClick={() => window.location.reload()}>
            <IconBagLogo /><h1 className="text-2xl font-bold tracking-tight text-[#ee4d2d]"><span className="text-black">Shox</span>ped</h1>
          </div>
          <div className="flex-1 w-full max-w-[1200px]">
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full shadow-sm relative group">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari produk akurat..." className="w-full h-10 px-4 pr-10 bg-gray-50 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-[#ee4d2d]" />
                {query && (<button type="button" onClick={() => setQuery("")} className="absolute right-[70px] top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></button>)}
                <button type="button" className="h-10 px-6 bg-[#ee4d2d] rounded-r-md flex items-center justify-center shrink-0"><IconSearch /></button>
            </form>
          </div>
        </div>
      </header>

      <div className="bg-white py-3 border-b border-gray-100 text-center px-4"><p className="text-sm font-semibold text-gray-700">💡 {hooks[hookIndex]}</p></div>

      {/* MAIN CONTENT */}
      <div className='w-full max-w-[1200px] mx-auto px-4 mt-6'>
        {query === "" && activeCategory === "Semua" && (<div className="mb-2 flex flex-col gap-6"><Carousel featuredProducts={carouselData} /><RacunSection data={racunData} /></div>)}

        <div className="sticky top-[65px] z-[50] bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 overflow-x-auto no-scrollbar border-b border-gray-200 shadow-sm">
            <div className="flex gap-3">{categories.map((cat) => (<button key={cat} onClick={() => { setActiveCategory(cat); setQuery(""); }} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border shadow-sm ${activeCategory === cat ? 'bg-[#ee4d2d] text-white border-[#ee4d2d]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}>{cat}</button>))}</div>
        </div>

        <div className="flex items-center gap-2 mb-6 mt-6"><span className="text-xl animate-bounce">🎁</span><h2 className="font-bold text-gray-800 text-lg">{loading ? "Membuka Gudang Promo..." : (query || activeCategory !== "Semua" ? `Hasil Akurat: ${query || activeCategory}` : "Rekomendasi Shopee vs Tiktok")}</h2></div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.slice(0, visibleCount).map((item) => {
            const diff = Math.abs(item.shopeePrice - item.tiktokPrice);
            const showBadge = diff > 5000; 
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative group">
                <div className="bg-gray-200 relative aspect-square overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  {showBadge && (<div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-br-lg z-20 shadow-md animate-pulse">HEMAT {formatRupiah(diff)}</div>)}
                  <button onClick={() => isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm z-10">{isInWishlist(item.id) ? <IconHeartSolid /> : <IconHeartOutline />}</button>
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2">{item.title}</h3>
                  <div className="space-y-1 mb-3 bg-gray-50 p-2 rounded-lg -mx-1">
                    <div className="flex justify-between text-[11px]"><span className="text-[#ee4d2d] font-bold">Shopee</span><span className="font-bold">{formatRupiah(item.shopeePrice)}</span></div>
                    <div className="flex justify-between text-[11px] border-t border-gray-200 pt-1 mt-1"><span className="text-black font-bold">TikTok</span><span className="font-bold">{formatRupiah(item.tiktokPrice)}</span></div>
                  </div>
                  <div className="flex flex-row gap-1 mt-auto"> 
                      {/* LINK SHOPEE */}
                      <a href={item.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 text-[10px] font-bold py-1.5 rounded text-center bg-[#ee4d2d] text-white hover:bg-orange-600 transition">Shopee</a>
                      
                      {/* LINK TIKTOK */}
                      <a 
                        href={item.tiktokLink} 
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => handleTikTokBuy(e, item)}
                        className="flex-1 text-[10px] font-bold py-1.5 rounded text-center bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                      >
                        TikTok
                      </a>
                  </div>
                  {/* DISCLAIMER LENGKAP */}
                  <p className="text-[8px] text-gray-400 text-center mt-2 leading-tight">Harga dapat berubah sewaktu-waktu. Cek harga real-time, klik tombol Shopee atau Tiktok diatas.</p>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={observerTarget} className="py-12 w-full flex justify-center">{loading ? <div className="w-8 h-8 border-4 border-[#ee4d2d] border-t-transparent rounded-full animate-spin"></div> : null}</div>
      </div>
      <ShareButtonFix /><div className="hidden md:block"><Footer /></div>
    </div>
  );
}