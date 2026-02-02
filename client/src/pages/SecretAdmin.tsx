import React, { useState, useEffect } from 'react';
import { auth, realtimeDb, db } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { collection, writeBatch, doc, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'; 
import Papa from 'papaparse'; 

// --- HELPER: DETEKSI KATEGORI OTOMATIS (AI) ---
const detectCategory = (title: string, originalCategory: string) => {
    const tLower = title.toLowerCase();
    // Keywords
    const kwSepatu = ['sepatu', 'sneakers', 'sandal', 'boots', 'shoes', 'heels', 'wedges', 'flat', 'kets', 'slip on', 'loafers', 'trainers', 'running', 'sport', 'futsal', 'bola', 'crocs', 'baim', 'slop', 'sandals'];
    const kwTas = ['tas', 'bag', 'tote', 'ransel', 'dompet', 'backpack', 'clutch', 'waistbag', 'sling', 'shoulder', 'wallet', 'koper', 'duffel', 'handbag', 'selempang', 'pouch', 'travel', 'luggage'];
    const kwKecantikan = ['serum', 'skincare', 'toner', 'facial', 'sunscreen', 'lipstik', 'cream', 'lotion', 'masker', 'essence', 'moisturizer', 'foundation', 'powder', 'bedak', 'lip', 'eye', 'hair', 'shampoo', 'sabun', 'body', 'parfum', 'perfume', 'fragrance', 'beauty', 'acne', 'jerawat', 'cleanser', 'micellar', 'wardah', 'somethinc', 'skintific', 'msglow', 'scarlett'];
    const kwElektronik = ['hp', 'handphone', 'case', 'kabel', 'headset', 'charger', 'iphone', 'android', 'samsung', 'xiaomi', 'oppo', 'vivo', 'realme', 'infinix', 'laptop', 'mouse', 'keyboard', 'earphone', 'tws', 'speaker', 'bluetooth', 'powerbank', 'usb', 'monitor', 'tv', 'kamera', 'camera', 'tripod', 'watch', 'jam', 'smartwatch'];
    const kwFashion = ['baju', 'kemeja', 'dress', 'kaos', 'celana', 'rok', 'jaket', 'hoodie', 'sweater', 't-shirt', 'shirt', 'blouse', 'tunik', 'gamis', 'hijab', 'jilbab', 'batik', 'piyama', 'underwear', 'bra', 'cd', 'sarinah', 'pakaian', 'jeans', 'chino', 'kulot', 'cardigan', 'vest', 'blazer', 'setelan', 'polo', 'sock', 'kaos kaki', 'daster', 'mukena', 'ciput', 'manset'];
    const kwRumah = ['kopi', 'coffee', 'gula', 'teh', 'sabun cuci', 'detergen', 'piring', 'gelas', 'botol', 'sapu', 'pel', 'rak', 'organizer', 'dapur', 'pisau', 'wajan', 'panci', 'sprei', 'bantal', 'guling', 'handuk', 'lampu'];

    if (kwSepatu.some(k => tLower.includes(k))) return "Sepatu";
    if (kwTas.some(k => tLower.includes(k))) return "Tas";
    if (kwKecantikan.some(k => tLower.includes(k))) return "Kecantikan";
    if (kwElektronik.some(k => tLower.includes(k))) return "Elektronik";
    if (kwFashion.some(k => tLower.includes(k))) return "Pakaian Wanita";
    if (kwRumah.some(k => tLower.includes(k))) return "Rumah Tangga";
    
    if (originalCategory && originalCategory !== "General") return originalCategory;
    return "Lainnya";
};

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'products' | 'manual'>('products');

  // STATE PRODUK
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // STATE INPUT MANUAL
  const [manualProduct, setManualProduct] = useState({
      name: '', price: '', image: '', link: '', category: 'Sepatu', sold: '0'
  });

  const categories = ["Sepatu", "Pakaian Pria", "Pakaian Wanita", "Aksesoris", "Muslim", "Kecantikan", "Gadget", "Elektronik", "Rumah Tangga", "Lainnya"];

  // --- AUTH & INIT ---
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
        console.log("Data loaded:", data.length);
    } catch (e) { console.error(e); }
    setLoadingData(false);
  };

  // --- NEW FEATURE: SYNC BUTTON ---
  const handleSync = async () => {
    setLoadingData(true);
    await fetchAllProducts();
    alert("Database Berhasil Disinkronkan! Total Produk: " + allProducts.length);
    setLoadingData(false);
  };

  const handleDeleteProduct = async (id: string) => {
      if(!confirm("Yakin hapus?")) return;
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
        setManualProduct({ name: '', price: '', image: '', link: '', category: 'Sepatu', sold: '0' });
        fetchAllProducts();
    } catch (e) { alert("Gagal Simpan: " + e); }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data;
        const batch = writeBatch(db);
        rawData.forEach((item: any) => {
            const rawTitle = item['Title'] || '';
            // Buat ID unik dari nama produk
            const docId = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
            const data = {
                name: rawTitle,
                price: parseInt(item['Price']) || 0,
                image: item['ItemCard__image src'] || '',
                link: item['Affiliate Link'] || '',
                category: detectCategory(rawTitle, item['Category']),
                sold: item['Sales'] || '0'
            };
            const dRef = doc(db, "products", docId || Math.random().toString());
            batch.set(dRef, data);
        });
        await batch.commit();
        alert("Upload Selesai!");
        setIsUploading(false);
        fetchAllProducts();
      }
    });
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
                {/* TOMBOL SYNC DATABASE BARU */}
                <button onClick={handleSync} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-green-700 transition uppercase flex items-center gap-2">
                    <span>🔄</span> {loadingData ? 'Loading...' : 'Sync DB'}
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
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Import Database</h3>
                        <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-2xl p-10 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 cursor-pointer group transition-all">
                            <span className="text-4xl mb-4 group-hover:scale-125 transition">📂</span>
                            <span className="text-xs font-black text-slate-500 group-hover:text-orange-600 uppercase">Upload CSV Shopee</span>
                            <input type="file" accept=".csv" onChange={handleFileUpload} disabled={isUploading} className="hidden"/>
                        </label>
                        {isUploading && <div className="mt-4 p-4 bg-orange-600 text-white text-center rounded-xl animate-pulse font-black text-xs uppercase tracking-widest">Processing...</div>}
                    </div>
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
                                    <tr><th className="px-6 py-4">Produk</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4 text-center">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50).map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition group">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="p"/>
                                                <p className="font-bold text-slate-700 line-clamp-1">{p.name}</p>
                                            </td>
                                            <td className="px-6 py-4 font-black text-orange-600">Rp{Number(p.price).toLocaleString()}</td>
                                            <td className="px-6 py-4 uppercase font-black text-slate-400">{p.category}</td>
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
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Input Produk Manual</h3>
                    <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Nama Barang</label>
                            <input type="text" value={manualProduct.name} onChange={e => setManualProduct({...manualProduct, name: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Harga Shopee</label>
                            <input type="number" value={manualProduct.price} onChange={e => setManualProduct({...manualProduct, price: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Kategori</label>
                            <select value={manualProduct.category} onChange={e => setManualProduct({...manualProduct, category: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Link Produk Shopee</label>
                            <input type="url" value={manualProduct.link} onChange={e => setManualProduct({...manualProduct, link: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Link Gambar</label>
                            <input type="url" value={manualProduct.image} onChange={e => setManualProduct({...manualProduct, image: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-bold" required />
                        </div>
                        <button className="md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition shadow-lg mt-4">Simpan Produk 🚀</button>
                    </form>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 sticky top-32">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Preview Card</h3>
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col mx-auto max-w-[200px]">
                            <div className="aspect-square bg-slate-100"><img src={manualProduct.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="prev"/></div>
                            <div className="p-3">
                                <h3 className="text-[10px] font-bold text-slate-800 line-clamp-2 mb-2">{manualProduct.name || 'Nama Produk...'}</h3>
                                <div className="space-y-1 bg-slate-50 p-2 rounded-xl text-[9px] font-black">
                                    <div className="flex justify-between"><span className="text-orange-600">Shopee</span><span>Rp{Number(manualProduct.price).toLocaleString()}</span></div>
                                    <div className="flex justify-between text-green-600 border-t pt-1 mt-1"><span>TikTok</span><span>Rp{Math.floor(Number(manualProduct.price) * 1.1).toLocaleString()}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}