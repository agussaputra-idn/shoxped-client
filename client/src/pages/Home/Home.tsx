import React, { useState, useEffect } from 'react';
import Carousel from 'src/components/Carousel/Carousel';
import { db } from 'src/firebase'; 
import { doc, updateDoc, increment, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

const isMatch = (text: string, keywords: string[]) => {
    const pattern = new RegExp(`\\b(${keywords.join('|')})`, 'i'); 
    return pattern.test(text);
};

// --- JURUS PENGACAK (SHUFFLE ALGORITHM) ---
// Ini algoritma Fisher-Yates, pengacak paling adil sedunia
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; 

  // --- ANALYTICS ---
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

  // --- FETCH & SHUFFLE DATA ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            
            const fetchedProducts = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const title = data.name || "Produk Tanpa Nama";
                const price = parseInt(data.price) || 0;
                let image = data.image;
                if (!image || !image.startsWith('http')) image = FALLBACK_IMAGE;

                let category = data.category;
                if (!category || category === "" || category === "General") {
                    const tLower = title.toLowerCase();
                    const kwSepatu = ['sepatu', 'sneakers', 'sandal', 'boots', 'shoes'];
                    const kwTas = ['tas', 'bag', 'tote', 'ransel', 'dompet', 'backpack'];
                    const kwKecantikan = ['serum', 'skincare', 'toner', 'facial', 'sunscreen', 'lipstik', 'cream', 'lotion', 'parfum', 'beauty'];
                    const kwElektronik = ['hp', 'handphone', 'case', 'iphone', 'android', 'samsung', 'xiaomi', 'laptop', 'headset'];
                    const kwFashion = ['baju', 'kemeja', 'dress', 'kaos', 'celana', 'rok', 'jaket', 'hoodie', 'gamis', 'hijab'];

                    if (isMatch(tLower, kwSepatu)) category = "Sepatu";
                    else if (isMatch(tLower, kwTas)) category = "Tas";
                    else if (isMatch(tLower, kwKecantikan)) category = "Kecantikan";
                    else if (isMatch(tLower, kwElektronik)) category = "Elektronik";
                    else if (isMatch(tLower, kwFashion)) category = "Fashion";
                    else category = "Lainnya";
                }

                const isShopeeCheaper = Math.random() < 0.6;
                const variance = Math.random() * 0.3; 
                let tiktokPrice = isShopeeCheaper ? Math.floor(price * (1 + variance)) : Math.floor(price * (1 - variance));
                const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
                const keywords = cleanTitle.split(/\s+/).slice(0, 5).join(" ");

                return {
                    id: doc.id,
                    title: title,
                    shopeePrice: price,
                    image: image,
                    shopeeLink: data.shopeeLink || "#",
                    shopeeSearchFallback: `https://shopee.co.id/search?keyword=${encodeURIComponent(keywords)}`,
                    tiktokPrice: tiktokPrice,
                    tiktokLink: `https://www.tiktok.com/search?q=${encodeURIComponent(keywords)}`,
                    category: category,
                    sales: data.sold || "0 Terjual",
                    shopName: "Star Seller"
                };
            });

            // 🔥 DISINI KUNCINYA: KITA ACAK DATA SEBELUM DITAMPILKAN
            const randomProducts = shuffleArray(fetchedProducts);
            
            setProducts(randomProducts);
            setLoading(false);
        } catch (error) { 
            console.error("Error:", error); 
            setLoading(false); 
        }
    };
    fetchData();
  }, []);

  // Reset page kalau ganti kategori, TAPI JANGAN ACAK ULANG (Biar user ga bingung)
  useEffect(() => { setCurrentPage(1); }, [selectedCategory]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const filteredProducts = selectedCategory === "Semua" ? products : products.filter(p => p.category === selectedCategory);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    { name: "Semua", icon: "🛍️" },
    { name: "Fashion", icon: "👕" },
    { name: "Sepatu", icon: "👟" },
    { name: "Tas", icon: "👜" },
    { name: "Elektronik", icon: "📱" },
    { name: "Kecantikan", icon: "💄" },
    { name: "Lainnya", icon: "🏠" },
  ];

  return (
    <div className='w-full flex flex-col min-h-screen bg-gray-50'>
      <div className="w-full py-3 px-2 bg-orange-50 border-b border-orange-100 shadow-sm z-10 flex items-center justify-center">
        <p className="text-center text-sm md:text-base text-gray-800 font-medium leading-snug">
            <span className="opacity-80">Cek Dulu Disini.</span><br className="block sm:hidden" /> 
            <span className="text-[#ee4d2d] font-bold ml-1">Shopee</span><span className="mx-1">atau</span><span className="text-black font-bold">TikTok</span><span className="ml-1">yang Lebih Murah?</span>
        </p>
      </div>

      <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 pb-12'>
        <div className='w-full mt-6 rounded-xl overflow-hidden shadow-sm'>
            <Carousel />
        </div>

        <div id="category-section" className='mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
           <div className='flex items-start justify-between md:justify-around overflow-x-auto pb-2 scrollbar-hide gap-4'>
              {categories.map((cat, index) => (
                <div key={index} onClick={() => setSelectedCategory(cat.name)} className={`flex flex-col items-center min-w-[70px] cursor-pointer group transition-all ${selectedCategory === cat.name ? 'scale-110 font-bold' : 'opacity-80 hover:opacity-100'}`}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 border transition-all shadow-sm ${selectedCategory === cat.name ? 'bg-orange-100 border-orange-500' : 'bg-white border-gray-200 group-hover:border-orange-200'}`}>{cat.icon}</div>
                  <span className={`text-xs md:text-sm font-medium transition-colors ${selectedCategory === cat.name ? 'text-orange-600' : 'text-gray-600'}`}>{cat.name}</span>
                </div>
              ))}
           </div>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-between mb-4 px-1'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-800'>
                {selectedCategory === "Semua" ? "Rekomendasi Untukmu" : `Kategori: ${selectedCategory}`}
                <span className="ml-2 text-sm font-normal text-gray-500">
                    (Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} dari {filteredProducts.length} Produk)
                </span>
            </h2>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 min-h-[600px]'>
            {loading ? (
              [...Array(10)].map((_, i) => <div key={i} className='bg-white rounded-xl shadow-sm h-80 animate-pulse border border-gray-100' />)
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div key={item.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col'>
                    <div className='w-full aspect-square relative overflow-hidden bg-gray-100'>
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' 
                            onError={(e:any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} 
                        />
                    </div> 
                    <div className='p-4 flex flex-col flex-grow justify-between'>
                        <h3 className='text-sm text-gray-800 font-semibold line-clamp-2 leading-snug mb-1' title={item.title}>{item.title}</h3>
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500">
                             <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium truncate max-w-[100px]">{item.shopName}</span>
                             <span>•</span>
                             <span>{item.sales}</span>
                        </div>
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
                                <a href={item.shopeeLink} target="_blank" rel="noreferrer" className="flex-1 bg-white text-[#ee4d2d] border border-[#ee4d2d] text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-[#ee4d2d] hover:text-white hover:shadow-md">Beli di Shopee</a>
                                <a href={item.tiktokLink} target="_blank" rel="noreferrer" className="flex-1 bg-white text-gray-800 border border-gray-300 text-[10px] md:text-xs font-bold py-2.5 rounded-lg text-center transition-all hover:bg-black hover:text-white hover:border-black hover:shadow-md">Beli di TikTok</a>
                            </div>
                            <div className="text-center">
                                <a href={item.shopeeSearchFallback} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 underline hover:text-[#ee4d2d] transition-colors cursor-pointer block mb-1">Cari Serupa di Shopee</a>
                                <p className="text-[9px] text-gray-300 italic">*Harga dapat berubah sewaktu-waktu</p>
                            </div>
                        </div>
                    </div>
                </div>
              ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500"><p>Tidak ada produk di kategori ini.</p></div>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-8 flex-wrap">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 bg-white">&lt; Prev</button>
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                         return <button key={pageNum} onClick={() => paginate(pageNum)} className={`w-10 h-10 rounded-md font-bold transition-colors ${currentPage === pageNum ? 'bg-[#ee4d2d] text-white border border-[#ee4d2d]' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{pageNum}</button>;
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) { return <span key={pageNum} className="text-gray-400">...</span>; }
                    return null;
                })}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 bg-white">Next &gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}