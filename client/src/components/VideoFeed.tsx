import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

// Helper: Acak urutan array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Helper: Format Rupiah
const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const VideoFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. AMBIL MANUAL FEED (Video Admin)
        const qFeed = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
        const feedSnapshot = await getDocs(qFeed);
        const manualFeeds = feedSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            isManual: true, 
            ...doc.data() 
        }));

        // 2. AMBIL PRODUK (Acak)
        const qProd = query(collection(db, "products"), limit(50)); 
        const prodSnapshot = await getDocs(qProd);
        const allProducts = prodSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: `auto-${doc.id}`,
                type: 'image',
                title: data.name || 'Produk',
                src: data.image,
                price: data.price ? formatRupiah(data.price) : 'Cek Harga',
                link: data.shopeeLink,
                category: data.category || 'General',
                isManual: false
            };
        });

        const productsByCategory: Record<string, any[]> = {};
        allProducts.forEach(p => {
            if (!productsByCategory[p.category]) productsByCategory[p.category] = [];
            productsByCategory[p.category].push(p);
        });

        // Pilih 3 Kategori Acak
        let availableCategories = shuffleArray(Object.keys(productsByCategory));
        const selectedProducts: any[] = [];
        const maxProducts = 3;

        for (const cat of availableCategories) {
            if (selectedProducts.length >= maxProducts) break;
            const productsInCat = productsByCategory[cat];
            selectedProducts.push(productsInCat[Math.floor(Math.random() * productsInCat.length)]);
        }

        // Isi sisa jika kurang dari 3
        if (selectedProducts.length < maxProducts) {
            const remainingNeeded = maxProducts - selectedProducts.length;
            const usedIds = new Set(selectedProducts.map(p => p.id));
            const leftovers = allProducts.filter(p => !usedIds.has(p.id));
            selectedProducts.push(...shuffleArray(leftovers).slice(0, remainingNeeded));
        }

        // CATATAN: Banner Promo sekarang KITA PISAH dari 'feedItems'
        // agar posisinya fixed dan rapi (Bento Grid), tidak ikut teracak di bawah.
        
        // Gabungkan Video & Produk Pilihan
        let combined = [...manualFeeds, ...selectedProducts];
        combined = shuffleArray(combined); 

        setFeedItems(combined);
        setLoading(false);

      } catch (error) {
        console.error("Error building feed:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logic Autoplay
  useEffect(() => {
    if (loading || feedItems.length === 0) return;
    const options = { root: null, rootMargin: '0px', threshold: 0.65 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (video.tagName !== 'VIDEO') return;
        if (entry.isIntersecting) {
            video.muted = isMuted;
            video.play().catch(() => {});
        } else {
            video.pause();
        }
      });
    }, options);

    setTimeout(() => {
        if (containerRef.current) {
            const videos = containerRef.current.querySelectorAll('video');
            videos.forEach((v) => observer.observe(v));
        }
    }, 1500);
    return () => observer.disconnect();
  }, [loading, feedItems, isMuted]);

  const toggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); e.preventDefault();
    const btn = e.currentTarget;
    const video = btn.previousElementSibling as HTMLVideoElement;
    if(video) {
        video.muted = !video.muted;
        setIsMuted(video.muted);
        if(!video.muted && video.paused) video.play();
    }
  };

  if (loading) return null;

  return (
    <div className="p-0 md:p-2" ref={containerRef}>
      
      <div className="flex items-center px-3 mb-3 mt-4">
         <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
            🎉 Pesta Promo
         </h3>
      </div>

      {/* --- BENTO GRID PROMO SECTION (FIXED LAYOUT) --- */}
      {/* Ini yang bikin tampilan HP jadi rapi presisi */}
      <div className="grid grid-cols-2 gap-2 px-2 mb-4 h-[280px] md:h-[320px]">
          
          {/* KOLOM KIRI: Flash Sale & Gratis Ongkir */}
          <div className="flex flex-col gap-2 h-full">
              {/* 1. Flash Sale */}
              <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 flex flex-col justify-center shadow-sm">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                  <h4 className="font-black text-lg md:text-xl italic leading-none mb-1">FLASH SALE</h4>
                  <p className="text-[10px] md:text-xs font-medium opacity-90">Diskon 90%</p>
                  <span className="text-[9px] bg-white/20 w-max px-2 py-0.5 rounded mt-2">Berakhir 23:59</span>
              </div>
              {/* 2. Gratis Ongkir */}
              <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 flex flex-col justify-center shadow-sm">
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
                  <h4 className="font-black text-lg md:text-xl leading-none mb-1">GRATIS ONGKIR</h4>
                  <p className="text-[10px] md:text-xs font-medium opacity-90">Min. Belanja Rp0</p>
                  <span className="text-[9px] bg-white/20 w-max px-2 py-0.5 rounded mt-2">Cek Voucher</span>
              </div>
          </div>

          {/* KOLOM KANAN: Brand Day (Full Vertical) */}
          <div className="h-full relative rounded-xl overflow-hidden bg-gradient-to-b from-purple-600 to-indigo-600 text-white p-4 flex flex-col items-center justify-center text-center shadow-sm">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://via.placeholder.com/150')] opacity-10 mix-blend-overlay"></div>
               <div className="relative z-10">
                   <div className="text-3xl md:text-5xl mb-2">🎁</div>
                   <h4 className="font-black text-xl md:text-2xl leading-none mb-2">BRAND DAY</h4>
                   <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-3 border border-white/10">
                       <p className="text-[10px] md:text-xs font-bold">Ekstra Voucher</p>
                       <p className="text-lg md:text-xl font-black text-yellow-300">50RB</p>
                   </div>
                   <button className="text-[10px] bg-white text-purple-700 font-bold px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition">KLAIM</button>
               </div>
          </div>
      </div>
      
      {/* --- MASONRY GRID (SISANYA: VIDEO & PRODUK) --- */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3 px-2 pb-6">
        {feedItems.map((item: any) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
            
            {/* TIPE VIDEO */}
            {item.type === 'video' && (
              <div className="relative bg-black w-full">
                <div className="relative pt-[177%] bg-gray-900"> 
                    <video className="absolute top-0 left-0 w-full h-full object-cover" src={item.src} poster={item.poster} loop playsInline muted />
                    <button onClick={(e) => toggleMute(e, item.id)} className="absolute bottom-16 right-3 z-20 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition">
                       {isMuted ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> : <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-3">
                        <span className="bg-[#ee4d2d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded w-max mb-1.5">SHOPEE VIDEO</span>
                        <h4 className="text-white text-xs font-medium line-clamp-2 leading-snug mb-1 drop-shadow-md">{item.title}</h4>
                        <p className="text-white font-bold text-sm drop-shadow-md">{item.price}</p>
                    </div>
                </div>
              </div>
            )}

            {/* TIPE IMAGE (PRODUK PILIHAN) */}
            {item.type === 'image' && (
              <div className="cursor-pointer relative" onClick={() => item.link && window.open(item.link, '_blank')}>
                <div className="absolute top-2 left-2 z-10">
                     <span className="bg-white/90 text-gray-800 text-[9px] px-2.5 py-1 rounded-full shadow-sm font-bold uppercase tracking-wider border border-gray-100">
                        {item.category}
                     </span>
                </div>
                <img src={item.src} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" onError={(e:any) => e.target.src = 'https://via.placeholder.com/300x400?text=Produk'} />
                <div className="p-3 bg-white relative z-20">
                    <h4 className="text-xs font-medium text-gray-700 line-clamp-2 mb-2 leading-relaxed">{item.title}</h4>
                    <span className="text-[#ee4d2d] font-bold text-sm">{item.price}</span>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;