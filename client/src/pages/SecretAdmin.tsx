import React, { useState, useEffect } from 'react';
import { auth, realtimeDb, db } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { collection, writeBatch, doc, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'; 
import Papa from 'papaparse'; 

// --- HELPER: DETEKSI KATEGORI ---
const detectCategory = (title: string, originalCategory: string) => {
    const tLower = title.toLowerCase();
    
    if (originalCategory === "601152") return "Pakaian Wanita"; 
    if (originalCategory === "600024") return "Perlengkapan Rumah";
    if (originalCategory === "601450") return "Tas Wanita";
    if (originalCategory === "700437") return "Makanan & Minuman"; 

    const kwSepatu = ['sepatu', 'sneakers', 'sandal', 'boots', 'shoes', 'heels', 'wedges', 'flat', 'kets', 'slip on', 'loafers', 'trainers', 'running', 'sport', 'futsal', 'bola', 'crocs', 'baim', 'slop', 'sandals'];
    const kwTas = ['tas', 'bag', 'tote', 'ransel', 'dompet', 'backpack', 'clutch', 'waistbag', 'sling', 'shoulder', 'wallet', 'koper', 'duffel', 'handbag', 'selempang', 'pouch', 'travel', 'luggage'];
    const kwKecantikan = ['serum', 'skincare', 'toner', 'facial', 'sunscreen', 'lipstik', 'cream', 'lotion', 'masker', 'essence', 'moisturizer', 'foundation', 'powder', 'bedak', 'hair', 'shampoo', 'sabun', 'body', 'parfum', 'perfume', 'beauty', 'acne', 'cleanser'];
    const kwGadget = ['hp', 'handphone', 'case', 'kabel', 'headset', 'charger', 'iphone', 'android', 'samsung', 'xiaomi', 'oppo', 'vivo', 'realme', 'infinix', 'laptop', 'mouse', 'keyboard', 'earphone', 'tws', 'speaker', 'bluetooth', 'powerbank', 'usb', 'monitor', 'tv', 'kamera', 'tripod', 'smartwatch'];
    const kwFashion = ['baju', 'kemeja', 'dress', 'kaos', 'celana', 'rok', 'jaket', 'hoodie', 'sweater', 't-shirt', 'shirt', 'blouse', 'tunik', 'gamis', 'hijab', 'jilbab', 'batik', 'piyama', 'pakaian', 'jeans', 'chino', 'kulot', 'cardigan', 'blazer', 'setelan', 'polo', 'daster', 'mukena', 'vest', 'outer'];
    const kwRumah = ['kopi', 'coffee', 'gula', 'teh', 'sabun cuci', 'detergen', 'piring', 'gelas', 'botol', 'sapu', 'pel', 'rak', 'organizer', 'dapur', 'pisau', 'wajan', 'panci', 'sprei', 'bantal', 'guling', 'handuk', 'lampu', 'peralatan rumah', 'botol minum', 'tumbler', 'termos'];
    const kwMakanan = ['makanan', 'minuman', 'snack', 'camilan', 'keripik', 'cokelat', 'mie', 'instan', 'bumbu', 'sambal', 'frozen food', 'basreng', 'seblak', 'kue', 'pedas', 'manis', 'asin'];
    const kwAnak = ['bayi', 'anak', 'baby', 'kids', 'popok', 'dot', 'mainan', 'baju anak', 'setelan anak'];

    if (kwSepatu.some(k => tLower.includes(k))) return "Sepatu Wanita";
    if (kwTas.some(k => tLower.includes(k))) return "Tas Wanita";
    if (kwKecantikan.some(k => tLower.includes(k))) return "Perawatan & Kecantikan";
    if (kwGadget.some(k => tLower.includes(k))) return "Handphone & Aksesoris";
    if (kwFashion.some(k => tLower.includes(k))) return "Pakaian Wanita";
    if (kwRumah.some(k => tLower.includes(k))) return "Perlengkapan Rumah";
    if (kwMakanan.some(k => tLower.includes(k))) return "Makanan & Minuman";
    if (kwAnak.some(k => tLower.includes(k))) return "Fashion Bayi & Anak";
    
    if (originalCategory && originalCategory !== "General") return originalCategory;
    return "Aksesoris Fashion"; 
};

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'products' | 'manual'>('products');

  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [manualProduct, setManualProduct] = useState({
      name: '', price: '', image: '', link: '', category: 'Tas Wanita', sold: '0', platform: 'shopee'
  });

  const categories = [
    "Tas Wanita", "Sepatu Wanita", "Sepatu Pria", "Aksesoris Fashion", 
    "Fashion Bayi & Anak", "Makanan & Minuman", "Pakaian Wanita", 
    "Perawatan & Kecantikan", "Handphone & Aksesoris", "Perlengkapan Rumah"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        onValue(ref(realtimeDb, 'stats/totalVisitors'), (snap) => setVisitorCount(snap.val() || 0));
        fetchAllProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err) { alert('Login Gagal!'); }
  };

  const fetchAllProducts = async () => {
    setLoadingData(true);
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(data);
    } catch (e) { console.error(e); }
    setLoadingData(false);
  };

  const handleSync = async () => {
    setLoadingData(true);
    await fetchAllProducts();
    alert("Database Berhasil Disinkronkan!");
    setLoadingData(false);
  };

  const handleDeleteProduct = async (id: string) => {
      if(!confirm("Yakin hapus produk ini?")) return;
      try {
          await deleteDoc(doc(db, "products", id));
          fetchAllProducts();
      } catch (e) { alert("Gagal hapus"); }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "products"), { 
            ...manualProduct, 
            price: Number(manualProduct.price), 
            createdAt: serverTimestamp() 
        });
        alert("Produk Berhasil Disimpan!");
        setManualProduct({ name: '', price: '', image: '', link: '', category: 'Tas Wanita', sold: '0', platform: 'shopee' });
        fetchAllProducts();
    } catch (e) { alert("Gagal Simpan: " + e); }
  };

  // --- HANDLER UPLOAD CSV (SHOPEE) ---
  const handleCsvUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data;
        const batch = writeBatch(db);
        
        let successCount = 0;
        let duplicateCount = 0;

        // 🛡️ ANTI DUPLIKAT: Cek Berdasarkan NAMA PRODUK (Bukan ID)
        // Kita buat daftar semua nama produk yang sudah ada di database, diubah ke huruf kecil biar akurat
        const existingTitles = new Set(allProducts.map(p => (p.name || "").toLowerCase().trim()));

        rawData.forEach((item: any) => {
            const rawTitle = item['Title'] || item['name'] || '';
            const cleanTitle = rawTitle.toLowerCase().trim();

            // Cek apakah judul ini SUDAH ADA di database?
            if (existingTitles.has(cleanTitle)) {
                duplicateCount++;
                return; // SKIP (Jangan diupload)
            }

            // Jika belum ada, lanjut proses
            const docId = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
            const data = {
                name: rawTitle,
                price: parseInt(item['Price'] || item['price']) || 0,
                image: item['ItemCard__image src'] || item['image'] || '',
                link: item['Affiliate Link'] || item['link'] || '',
                category: detectCategory(rawTitle, item['Category'] || item['category']),
                sold: item['Sales'] || item['sold'] || '0',
                platform: 'shopee',
                createdAt: serverTimestamp()
            };
            
            const dRef = doc(db, "products", docId || Math.random().toString());
            batch.set(dRef, data);
            
            // Masukkan ke daftar sementara agar tidak duplikat di file yang sama
            existingTitles.add(cleanTitle);
            successCount++;
        });

        if (successCount > 0) {
            await batch.commit();
        }
        
        alert(`Upload Shopee Selesai!\n✅ Sukses Masuk: ${successCount}\n⛔ Duplikat Dibuang: ${duplicateCount}`);
        setIsUploading(false);
        fetchAllProducts();
      }
    });
  };

  // --- HANDLER UPLOAD JSON (TIKTOK) ---
  const handleJsonUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            const batch = writeBatch(db);
            
            let successCount = 0;
            let duplicateCount = 0;

            // 🛡️ ANTI DUPLIKAT: Cek Berdasarkan NAMA PRODUK
            // ID dari scraper itu acak (Math.random), jadi tidak bisa dipakai untuk cek duplikat.
            // Kita harus cek JUDUL PRODUKNYA.
            const existingTitles = new Set(allProducts.map(p => (p.name || "").toLowerCase().trim()));

            json.forEach((item: any) => {
                const cleanTitle = item.title.toLowerCase().trim();

                // CEK: Apakah Judul ini sudah ada di gudang?
                if (existingTitles.has(cleanTitle)) {
                    duplicateCount++;
                    // console.log("Duplikat terdeteksi:", cleanTitle); // Debugging
                    return; // SKIP
                }

                // Jika Lolos, Buat Data Baru
                const docId = `tiktok-${item.tiktok_id}`; 
                const finalPrice = typeof item.price === 'number' ? item.price : parseInt(item.price);

                const data = {
                    name: item.title,
                    price: finalPrice || 0,
                    image: item.image,
                    link: item.link, 
                    tiktok_id: item.tiktok_id,
                    category: detectCategory(item.title, item.category_id),
                    sold: 'Laris', 
                    platform: 'tiktok',
                    createdAt: serverTimestamp()
                };
                
                const dRef = doc(db, "products", docId);
                batch.set(dRef, data);
                
                // Tambahkan ke memori sementara (biar di file JSON yang sama gak ada yang kembar)
                existingTitles.add(cleanTitle);
                successCount++;
            });

            if (successCount > 0) {
                await batch.commit();
            }

            alert(`Upload TikTok Selesai!\n✅ Sukses Masuk: ${successCount}\n⛔ Duplikat Dibuang: ${duplicateCount}`);
            setIsUploading(false);
            fetchAllProducts();

        } catch (error) {
            console.error(error);
            alert("Format JSON Salah atau File Rusak!");
            setIsUploading(false);
        }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-full max-w-md p-8 bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 text-center text-white">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-widest">Shoxped Login</h2>
            <form onSubmit={handleLogin} className="space-y-4 text-slate-800">
                <input type="email" placeholder="Email" className="w-full p-4 rounded-xl outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full p-4 rounded-xl outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-orange-600 p-4 rounded-xl text-white font-black hover:bg-orange-700 transition">LOGIN</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 md:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Secret<span className="text-orange-600">Dashboard</span></h1>
            <div className="flex items-center gap-4">
                <div className="text-right border-r pr-4 hidden md:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Visitors</p>
                    <p className="text-sm font-black text-slate-800">{visitorCount.toLocaleString()}</p>
                </div>
                <button onClick={handleSync} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-green-700 transition uppercase flex items-center gap-2">
                    <span>🔄</span> {loadingData ? 'Syncing...' : 'Sync DB'}
                </button>
                <button onClick={() => signOut(auth)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-red-600 transition uppercase">Logout</button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex gap-2 mb-8 bg-slate-200 p-1 rounded-2xl w-max shadow-inner">
            <button onClick={() => setActiveTab('products')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition ${activeTab === 'products' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>📦 Gudang</button>
            <button onClick={() => setActiveTab('manual')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition ${activeTab === 'manual' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>➕ Manual</button>
        </div>

        {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-1 space-y-4">
                    {/* CARD UPLOAD SHOPEE */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4">Import Shopee (CSV)</h3>
                        <label className="flex flex-col items-center justify-center border-4 border-dashed border-orange-100 rounded-2xl p-6 bg-orange-50 hover:bg-orange-100 cursor-pointer group transition-all">
                            <span className="text-3xl mb-2 group-hover:scale-110 transition">🟧</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Klik Upload CSV</span>
                            <input type="file" accept=".csv" onChange={handleCsvUpload} disabled={isUploading} className="hidden"/>
                        </label>
                    </div>

                    {/* CARD UPLOAD TIKTOK */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                        <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">Import TikTok (JSON)</h3>
                        <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer group transition-all">
                            <span className="text-3xl mb-2 group-hover:scale-110 transition">🎵</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Klik Upload JSON</span>
                            <input type="file" accept=".json" onChange={handleJsonUpload} disabled={isUploading} className="hidden"/>
                        </label>
                    </div>

                    {isUploading && <div className="p-4 bg-blue-600 text-white text-center rounded-xl animate-pulse font-black text-xs uppercase tracking-widest">Sedang Upload Data (Cek Duplikat Judul)...</div>}
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Daftar Produk ({allProducts.length})</h3>
                            <input type="text" placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                        </div>
                        <div className="overflow-x-auto max-h-[600px]">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                                    <tr><th className="px-6 py-4">Produk</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4">Platform</th><th className="px-6 py-4 text-center">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {allProducts.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50).map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition group">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="p"/>
                                                <p className="font-bold text-slate-700 line-clamp-1">{p.name}</p>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-800">Rp{Number(p.price).toLocaleString()}</td>
                                            <td className="px-6 py-4 uppercase font-black">
                                                <span className={`px-2 py-1 rounded text-[9px] ${p.platform === 'tiktok' ? 'bg-black text-white' : 'bg-orange-100 text-orange-600'}`}>
                                                    {p.platform || 'Shopee'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center"><button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:text-red-700">🗑️</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'manual' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-500">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Input Produk Manual</h3>
                        
                        {/* --- PLATFORM SWITCHER (BARU) --- */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setManualProduct({...manualProduct, platform: 'shopee'})}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase transition-all ${manualProduct.platform === 'shopee' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🟧 Shopee
                            </button>
                            <button 
                                onClick={() => setManualProduct({...manualProduct, platform: 'tiktok'})}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase transition-all ${manualProduct.platform === 'tiktok' ? 'bg-black text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🎵 TikTok
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* INPUT NAMA */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Nama Barang</label>
                            <input 
                                type="text" 
                                value={manualProduct.name} 
                                onChange={e => setManualProduct({...manualProduct, name: e.target.value})} 
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" 
                                required 
                            />
                        </div>

                        {/* INPUT HARGA */}
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">
                                Harga {manualProduct.platform === 'tiktok' ? 'TikTok' : 'Shopee'}
                            </label>
                            <input 
                                type="number" 
                                value={manualProduct.price} 
                                onChange={e => setManualProduct({...manualProduct, price: e.target.value})} 
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold" 
                                required 
                            />
                        </div>

                        {/* INPUT KATEGORI */}
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Kategori</label>
                            <select 
                                value={manualProduct.category} 
                                onChange={e => setManualProduct({...manualProduct, category: e.target.value})} 
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold appearance-none"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        {/* INPUT LINK PRODUK */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">
                                Link Produk {manualProduct.platform === 'tiktok' ? 'TikTok' : 'Shopee'}
                            </label>
                            <input 
                                type="text" 
                                value={manualProduct.link} 
                                onChange={e => setManualProduct({...manualProduct, link: e.target.value})} 
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" 
                                placeholder={manualProduct.platform === 'tiktok' ? "https://shop.tiktok.com/..." : "https://shopee.co.id/..."}
                                required 
                            />
                        </div>

                        {/* INPUT GAMBAR */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Link Gambar</label>
                            <input 
                                type="text" 
                                value={manualProduct.image} 
                                onChange={e => setManualProduct({...manualProduct, image: e.target.value})} 
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" 
                                placeholder="https://..."
                                required 
                            />
                        </div>

                        {/* TOMBOL SIMPAN (DINAMIS WARNA) */}
                        <button className={`md:col-span-2 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition shadow-lg mt-4 flex justify-center gap-2 ${manualProduct.platform === 'tiktok' ? 'bg-black hover:bg-gray-800' : 'bg-orange-600 hover:bg-orange-700'}`}>
                            <span>🚀</span> Simpan ke {manualProduct.platform === 'tiktok' ? 'TikTok' : 'Shopee'}
                        </button>
                    </form>
                </div>

                {/* --- LIVE PREVIEW (DINAMIS) --- */}
                <div className="hidden lg:block lg:col-span-1 sticky top-24 h-fit">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Live Preview</h3>
                    
                    {manualProduct.name || manualProduct.image ? (
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative transform transition hover:scale-105 duration-300">
                            <div className="bg-gray-200 relative aspect-square overflow-hidden">
                                <img 
                                    src={manualProduct.image || 'https://via.placeholder.com/300?text=No+Image'} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover" 
                                    onError={(e: any) => e.target.src = 'https://via.placeholder.com/300?text=Error+Image'}
                                />
                                {/* BADGE PLATFORM DINAMIS */}
                                <div className={`absolute top-2 left-2 text-[9px] font-black px-2 py-1 rounded shadow-sm ${manualProduct.platform === 'tiktok' ? 'bg-black text-white' : 'bg-orange-100 text-orange-600'}`}>
                                    {manualProduct.platform === 'tiktok' ? 'TIKTOK' : 'SHOPEE'}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col">
                                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-snug">
                                    {manualProduct.name || "Nama Produk Akan Muncul Disini..."}
                                </h3>
                                
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`${manualProduct.platform === 'tiktok' ? 'text-black' : 'text-orange-500'} font-bold`}>Harga</span>
                                        <span className="font-black text-lg text-slate-800">
                                            Rp{manualProduct.price ? Number(manualProduct.price).toLocaleString('id-ID') : '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] mt-1 text-slate-400">
                                        <span>Kategori</span>
                                        <span>{manualProduct.category}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2"> 
                                    {/* TOMBOL BELI DINAMIS */}
                                    <button className={`flex-1 text-[10px] font-bold py-2 rounded text-center text-white shadow-md ${manualProduct.platform === 'tiktok' ? 'bg-black' : 'bg-[#ee4d2d]'}`}>
                                        Beli di {manualProduct.platform === 'tiktok' ? 'TikTok' : 'Shopee'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-3xl shadow-inner border-2 border-dashed border-slate-200 h-64 flex flex-col items-center justify-center text-center opacity-50">
                            <span className="text-6xl mb-4 animate-bounce">👀</span>
                            <h4 className="font-black text-slate-400 uppercase">Menunggu Input...</h4>
                            <p className="text-xs text-slate-400 mt-2">Pilih Platform & Ketik Data</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}