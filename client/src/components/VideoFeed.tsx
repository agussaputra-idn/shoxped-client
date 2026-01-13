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

  // --- LOGIKA PENGACAKAN DIJALANKAN DISINI (OTOMATIS) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. AMBIL MANUAL FEED (Video/Banner Admin)
        const qFeed = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
        const feedSnapshot = await getDocs(qFeed);
        const manualFeeds = feedSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            isManual: true, 
            ...doc.data() 
        }));

        // 2. AMBIL POOL PRODUK & PILIH 3 KATEGORI UNIK SECARA ACAK
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

        // Di sini kuncinya: Kategori diacak setiap kali refresh
        let availableCategories = shuffleArray(Object.keys(productsByCategory));
        const selectedProducts: any[] = [];
        const maxProducts = 3;

        for (const cat of availableCategories) {
            if (selectedProducts.length >= maxProducts) break;
            const productsInCat = productsByCategory[cat];
            // Produk dalam kategori juga dipilih acak
            selectedProducts.push(productsInCat[Math.floor(Math.random() * productsInCat.length)]);
        }

        if (selectedProducts.length < maxProducts) {
            const remainingNeeded = maxProducts - selectedProducts.length;
            const usedIds = new Set(selectedProducts.map(p => p.id));
            const leftovers = allProducts.filter(p => !usedIds.has(p.id));
            selectedProducts.push(...shuffleArray(leftovers).slice(0, remainingNeeded));
        }

        // 3. BANNER PREMIUM
        const autoBanners = [
            {
                id: 'banner-flash-premium',
                type: 'banner',
                title: '🔥 FLASH SALE',
                price: 'Diskon 90% s/d 23:59 WIB!',
                bgClass: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
                isVertical: false
            },
            {
                id: 'banner-vertical-promo',
                type: 'banner',
                title: 'SUPER BRAND DAY',
                price: 'Ekstra Voucher 50RB + Hadiah Langsung',
                bgClass: 'bg-gradient-to-b from-purple-600 to-indigo-600 text-white',
                isVertical: true
            },
            {
                id: 'banner-gratis-ongkir',
                type: 'banner',
                title: '🚚 GRATIS ONGKIR',
                price: 'Min. Belanja Rp0 ke Seluruh Indonesia',
                bgClass: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
                isVertical: false
            }
        ];

        // 4. GABUNGKAN SEMUA & ACAK POSISINYA
        let combined = [...manualFeeds, ...autoBanners, ...selectedProducts];
        combined = shuffleArray(combined); // Posisi akhir diacak lagi

        setFeedItems(combined);
        setLoading(false);

      } catch (error) {
        console.error("Error building feed:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC AUTOPLAY VIDEO ---
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
  if (feedItems.length === 0) return null;

  return (
    <div className="p-0 md:p-2" ref={containerRef}>
      
      {/* --- BAGIAN JUDUL (TOMBOL ACAK SUDAH DIHAPUS) --- */}
      <div className="flex items-center px-3 mb-4 mt-4">
         <h3 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
            🎉 Pesta Promo & Racun Belanja
         </h3>
         {/* Tombol <button> "Acak Lagi" telah dihapus dari sini */}
      </div>
      
      {/* MASONRY GRID */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3 px-2 pb-6">
        {feedItems.map((item: any) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
            
            {/* TIPE 1: VIDEO */}
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

            {/* TIPE 2: IMAGE */}
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

            {/* TIPE 3: BANNER */}
            {item.type === 'banner' && (
               <div className={`relative p-6 flex flex-col items-center justify-center text-center overflow-hidden ${item.isVertical ? 'h-[300px] md:h-[380px]' : 'h-[180px]'} ${item.bgClass}`}>
                   <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 mix-blend-overlay pointer-events-none"></div>
                   <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-white/10 rotate-12 transform-gpu blur-3xl pointer-events-none"></div>
                   
                   <div className="relative z-10">
                       <h3 className={`font-black ${item.isVertical ? 'text-3xl md:text-4xl' : 'text-2xl'} leading-none mb-3 tracking-tighter drop-shadow-sm`}>{item.title}</h3>
                       <p className={`font-bold ${item.isVertical ? 'text-sm md:text-base' : 'text-xs'} bg-white/20 px-4 py-1.5 rounded-full inline-block backdrop-blur-md shadow-sm border border-white/30`}>{item.price}</p>
                       <button className="mt-5 text-xs font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-md">
                           KLAIM SEKARANG
                       </button>
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