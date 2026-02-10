import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 

/* ==================================================================================
   🔴 SECRET ADMIN - V9 (SMART DEDUPE EDITION)
   Fitur: Deduplikasi Cerdas (Judul + Harga), ID AccessTrade Asli, & Filter Sampah
   ================================================================================== */

// --- HELPER: DETEKSI KATEGORI ---
const detectCategory = (title: string, originalCategory: string) => {
    const tLower = title.toLowerCase();
    const cLower = originalCategory ? originalCategory.toLowerCase() : ""; 

    // 1. CEK KATEGORI DARI FILE (PRIORITAS)
    if (cLower.includes('food') || cLower.includes('beverage') || cLower.includes('makanan')) return "Makanan & Minuman";
    if (cLower.includes('fashion') && cLower.includes('muslim')) return "Fashion Muslim";
    if (cLower.includes('electronic') || cLower.includes('phone') || cLower.includes('gadget')) return "Handphone & Aksesoris";
    if (cLower.includes('home') || cLower.includes('living') || cLower.includes('rumah')) return "Perlengkapan Rumah";
    if (cLower.includes('health') || cLower.includes('beauty')) return "Perawatan & Kecantikan";

    // 2. FILTER HANDPHONE (HAPUS SAMPAH)
    if (cLower.includes('handphone') || cLower.includes('hp') || tLower.includes('iphone') || tLower.includes('samsung')) {
        const sampahKeywords = ['kaos kaki', 'baju', 'celana', 'sepatu', 'tas', 'makanan', 'helm', 'motor'];
        if (sampahKeywords.some(kw => tLower.includes(kw))) return "Aksesoris Fashion"; 
        return "Handphone & Aksesoris";
    }

    // 3. FALLBACK BY TITLE KEYWORDS
    if (tLower.includes('gamis') || tLower.includes('hijab') || tLower.includes('jilbab') || tLower.includes('mukena')) return "Fashion Muslim";
    if (tLower.includes('sepatu') || tLower.includes('sneakers')) return tLower.includes('wanita') ? "Sepatu Wanita" : "Sepatu Pria";
    if (tLower.includes('tas') || tLower.includes('bag') || tLower.includes('dompet')) return "Tas Wanita";
    if (tLower.includes('baju') || tLower.includes('dress') || tLower.includes('kemeja') || tLower.includes('blouse')) return "Pakaian Wanita";
    if (tLower.includes('serum') || tLower.includes('cream') || tLower.includes('sabun') || tLower.includes('skincare')) return "Perawatan & Kecantikan";
    if (tLower.includes('bayi') || tLower.includes('anak') || tLower.includes('kids')) return "Fashion Bayi & Anak";
    
    return "Aksesoris Fashion"; 
};

export default function SecretAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // DATA STATE
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // PILIHAN FORMAT FILE
  const [fileFormat, setFileFormat] = useState<'shopee' | 'accesstrade'>('shopee');

  const [manualProduct, setManualProduct] = useState({
      name: '', price: '', image: '', link: '', category: 'Tas Wanita', sold: '0', platform: 'shopee'
  });

  const categories = [
    "Tas Wanita", "Sepatu Wanita", "Sepatu Pria", "Aksesoris Fashion", 
    "Fashion Bayi & Anak", "Makanan & Minuman", "Pakaian Wanita", 
    "Perawatan & Kecantikan", "Handphone & Aksesoris", "Perlengkapan Rumah", "Fashion Muslim"
  ];

  // STATISTIK
  const totalProducts = accumulatedProducts.length;
  const shopeeCount = accumulatedProducts.filter(p => p.platform === 'shopee').length;
  const tiktokCount = accumulatedProducts.filter(p => p.platform === 'tiktok').length;
  const lazadaCount = accumulatedProducts.filter(p => p.platform === 'lazada').length;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (accumulatedProducts.length > 0) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [accumulatedProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(email === 'admin' && password === 'admin') { setIsLoggedIn(true); } 
    else { alert('Gunakan User: admin, Pass: admin'); }
  };

  const handleDownloadDB = () => {
    if (accumulatedProducts.length === 0) { alert("Belum ada data!"); return; }
    const fileData = JSON.stringify(accumulatedProducts, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "products.json";
    a.click();
    alert("✅ File products.json siap!");
  };

  const handleDeleteProduct = (id: string) => {
      if(!confirm("Yakin hapus produk ini?")) return;
      setAccumulatedProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleHardReset = () => {
      if(!confirm("YAKIN HAPUS SEMUA & REFRESH?")) return;
      window.location.reload();
  };

  const handleEditClick = (product: any) => { setEditingProduct(product); };
  const handleSaveEdit = () => {
      if (!editingProduct) return;
      setAccumulatedProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      alert("✅ Perubahan Disimpan!");
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.random().toString(36).substr(2, 9);
    const newItem = { ...manualProduct, id: newId, price: Number(manualProduct.price), createdAt: new Date().toISOString() };
    setAccumulatedProducts(prev => [newItem, ...prev]);
    alert("Produk Manual Ditambahkan!");
    setManualProduct({ name: '', price: '', image: '', link: '', category: 'Tas Wanita', sold: '0', platform: 'shopee' });
  };

  const cleanText = (text: string) => {
      if (!text) return "";
      return text.replace(/<[^>]*>?/gm, '').replace(/"/g, '').replace(/\\/g, '').replace(/\n/g, ' ').replace(/[^\x20-\x7E]/g, '').trim();
  };

  const handleLoadExistingDB = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            if (!Array.isArray(json)) { alert("Format salah!"); setIsUploading(false); return; }
            setAccumulatedProducts(json);
            alert(`✅ Database dimuat: ${json.length} produk.`);
            setIsUploading(false);
        } catch (error) { alert("File rusak!"); setIsUploading(false); }
    };
    reader.readAsText(file);
  };

  // --- 🔥 HANDLE CSV UPLOAD (V9 LOGIC) ---
  const handleCsvUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name.replace('.csv', '').replace('.xlsx', '');
    setIsUploading(true);
    
    const delimiter = fileFormat === 'accesstrade' ? ',' : ';'; 
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter, 
      transformHeader: (h) => h.trim().replace(/[\ufeff]/g, '').replace(/"/g, ''),
      complete: (results) => {
        const rawData = results.data;
        let newItems: any[] = [];
        let duplicateCount = 0;
        
        // 🔥 SMART DEDUPE KEY: Gunakan "Judul + Harga" sebagai kunci unik di memori
        // Jadi kalau judul sama tapi harga beda, tetap dianggap BARU.
        const existingKeys = new Set(accumulatedProducts.map(p => `${(p.name || "").toLowerCase().trim()}-${p.price}`));

        if(rawData.length === 0) { setIsUploading(false); return; }
        const keys = Object.keys(rawData[0] as any);
        
        // MAPPING KOLOM
        let colTitle = keys.find(k => ['merchant product name', 'product name', 'nama produk', 'title', 'line-clamp-2', 'name'].includes(k.toLowerCase())) 
                       || keys.find(k => k.toLowerCase().includes('name'));

        let colLink = keys.find(k => ['product url mobile (encoded)', 'product url web (encoded)', 'click_url', 'link', 'contents href', 'url'].includes(k.toLowerCase())) 
                      || keys.find(k => k.toLowerCase().includes('url'));

        let colImage = keys.find(k => ['image url', 'image_url', 'primary_image_url', 'itemcard__image src', 'inset-y-0 src', 'img', 'image'].includes(k.toLowerCase())) 
                       || keys.find(k => k.toLowerCase().includes('image'));

        let colPriceDiscount = keys.find(k => ['discounted price', 'sale_price', 'harga diskon'].includes(k.toLowerCase()));
        let colPriceNormal = keys.find(k => ['price', 'font-medium 2', 'font-medium', 'harga'].includes(k.toLowerCase()));

        let colSold = keys.find(k => ['item_sold', 'sales', 'sold', 'truncate 2', 'terjual'].includes(k.toLowerCase()));
        
        // Kolom ID Asli (AccessTrade)
        let colMerchantID = keys.find(k => ['merchant product id', 'product id'].includes(k.toLowerCase()));
        
        let colCatRaw = keys.find(k => ['category name', 'main category name', 'kategori'].includes(k.toLowerCase()));

        if (!colTitle || !colLink) {
            alert(`⚠️ FORMAT ${fileFormat.toUpperCase()} TIDAK COCOK!\nHeader: ${keys.slice(0,3).join(', ')}...`);
            setIsUploading(false);
            return;
        }

        rawData.forEach((item: any) => {
            const rawTitle = cleanText(item[colTitle!] || ''); 
            const cleanTitle = rawTitle.toLowerCase().trim();
            
            // Logika Harga
            let rawPrice = item[colPriceDiscount!] || item[colPriceNormal!] || '0';
            if (typeof rawPrice === 'string') rawPrice = rawPrice.replace(/[^0-9]/g, ''); 
            const finalPrice = parseInt(rawPrice) || 0;

            // 🔥 CEK DUPLIKAT CERDAS (JUDUL + HARGA)
            const uniqueKey = `${cleanTitle}-${finalPrice}`;
            if (existingKeys.has(uniqueKey)) { 
                duplicateCount++; 
                return; 
            }

            // Logika Gambar
            let finalImage = item[colImage!] || '';
            if(!finalImage && item['w-full src']) finalImage = item['w-full src']; 
            if(!finalImage && item['Image URL Additional']) finalImage = item['Image URL Additional'];

            // Logika Kategori
            let catRaw = colCatRaw ? item[colCatRaw] : fileName;
            let finalCategory = detectCategory(rawTitle, catRaw);

            // Platform
            let platform = 'shopee'; 
            if (file.name.toLowerCase().includes('lazada') || (item['Merchant Product ID'] && !item['item_sold'])) platform = 'lazada'; 
            if (file.name.toLowerCase().includes('tiktok')) platform = 'tiktok';

            // GUNAKAN ID ASLI JIKA ADA (Biar lebih valid)
            let docId = item[colMerchantID!] || Math.random().toString(36).substr(2, 9);

            newItems.push({
                id: docId,
                name: rawTitle, 
                price: finalPrice,
                image: finalImage,
                link: item[colLink!] || '',
                category: finalCategory, 
                sold: colSold ? (item[colSold] || 'Laris') : 'Laris',
                platform: platform,
                createdAt: new Date().toISOString()
            });
            existingKeys.add(uniqueKey);
        });

        setAccumulatedProducts(prev => [...prev, ...newItems]);
        alert(`✅ ${fileFormat.toUpperCase()} SUKSES!\nFile: ${fileName}\nMasuk: ${newItems.length}\nDuplikat (Identik): ${duplicateCount}`);
        setIsUploading(false);
      },
      error: (err) => { alert("Error: " + err.message); setIsUploading(false); }
    });
  };

  const handleJsonUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            let newItems: any[] = [];
            let duplicateCount = 0;
            const existingTitles = new Set(accumulatedProducts.map(p => (p.name || "").toLowerCase().trim()));
            json.forEach((item: any) => {
                const cleanTitle = item.title.toLowerCase().trim();
                if (existingTitles.has(cleanTitle)) { duplicateCount++; return; }
                const finalPrice = typeof item.price === 'number' ? item.price : parseInt(item.price);
                newItems.push({
                    id: `tiktok-${item.tiktok_id}`, name: item.title, price: finalPrice || 0, image: item.image, link: item.link, 
                    tiktok_id: item.tiktok_id, category: detectCategory(item.title, item.category_id || ''), sold: 'Laris', platform: 'tiktok', createdAt: new Date().toISOString()
                });
                existingTitles.add(cleanTitle);
            });
            setAccumulatedProducts(prev => [...prev, ...newItems]);
            alert(`TikTok: Masuk ${newItems.length} (Duplikat ${duplicateCount})`);
            setIsUploading(false);
        } catch (error) { alert("JSON Rusak"); setIsUploading(false); }
    };
    reader.readAsText(file);
  };

  const filteredData = accumulatedProducts.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const displayData = filteredData.slice(0, 50); 

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-full max-w-md p-8 bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 text-center text-white">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-widest">Shoxped Offline</h2>
            <form onSubmit={handleLogin} className="space-y-4 text-slate-800 mt-4">
                <input type="text" placeholder="User" className="w-full p-4 rounded-xl outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full p-4 rounded-xl outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-orange-600 p-4 rounded-xl text-white font-black hover:bg-orange-700 transition">MASUK</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-black text-slate-800 uppercase">Secret<span className="text-orange-600">Admin</span></h1>
            <div className="flex gap-2">
                <button onClick={handleDownloadDB} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700">💾 DOWNLOAD JSON</button>
                <button onClick={() => setIsLoggedIn(false)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800">LOGOUT</button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 text-white p-6 rounded-2xl shadow"><p className="text-xs font-bold text-slate-400">TOTAL PRODUK</p><h2 className="text-3xl font-black text-yellow-400">{totalProducts.toLocaleString()}</h2></div>
            <div className="bg-white p-6 rounded-2xl shadow border"><p className="text-xs font-bold text-slate-400">SHOPEE / LAZADA</p><h2 className="text-3xl font-black text-orange-600">{shopeeCount + lazadaCount}</h2></div>
            <div className="bg-white p-6 rounded-2xl shadow border"><p className="text-xs font-bold text-slate-400">TIKTOK</p><h2 className="text-3xl font-black text-black">{tiktokCount.toLocaleString()}</h2></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center"><button onClick={handleHardReset} className="w-full py-2 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700">🔄 REFRESH & HAPUS SEMUA</button></div>
                <div className="bg-white p-6 rounded-2xl shadow border"><h3 className="font-bold text-sm mb-4">1. DATABASE UTAMA</h3><input type="file" accept=".json" onChange={handleLoadExistingDB} className="text-xs w-full"/></div>
                
                <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-sm mb-4">2. IMPORT DATA</h3>
                    
                    {/* SELECTOR FORMAT */}
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setFileFormat('shopee')} className={`flex-1 py-2 text-xs font-bold rounded border ${fileFormat==='shopee' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-gray-50 text-gray-400'}`}>🟧 FORMAT SHOPEE (;)</button>
                        <button onClick={() => setFileFormat('accesstrade')} className={`flex-1 py-2 text-xs font-bold rounded border ${fileFormat==='accesstrade' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>🟦 ACCESSTRADE (,)</button>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 bg-orange-50 border border-orange-200 p-3 rounded-lg cursor-pointer hover:bg-orange-100"><span className="text-xl">📂</span><span className="text-xs font-bold text-orange-800">Upload CSV</span><input type="file" accept=".csv" onChange={handleCsvUpload} disabled={isUploading} className="hidden"/></label>
                        <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-100"><span className="text-xl">🎵</span><span className="text-xs font-bold text-slate-800">Upload JSON TikTok</span><input type="file" accept=".json" onChange={handleJsonUpload} disabled={isUploading} className="hidden"/></label>
                    </div>
                    {isUploading && <p className="text-xs text-center mt-2 text-blue-600 font-bold animate-pulse">Sedang Memproses...</p>}
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow border"><h3 className="font-bold text-sm mb-4">3. INPUT MANUAL</h3><form onSubmit={handleManualSubmit} className="space-y-3"><input type="text" placeholder="Nama Produk" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.name} onChange={e => setManualProduct({...manualProduct, name: e.target.value})} required /><input type="number" placeholder="Harga" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.price} onChange={e => setManualProduct({...manualProduct, price: e.target.value})} required /><select className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.category} onChange={e => setManualProduct({...manualProduct, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select><input type="text" placeholder="Link Produk" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.link} onChange={e => setManualProduct({...manualProduct, link: e.target.value})} required /><input type="text" placeholder="Link Gambar" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.image} onChange={e => setManualProduct({...manualProduct, image: e.target.value})} required /><button className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">TAMBAH ITEM</button></form></div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-hidden flex flex-col h-[800px] relative">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold text-sm">DAFTAR PRODUK ({filteredData.length})</h3><input type="text" placeholder="Cari Judul / Kategori..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-3 py-1.5 rounded-lg border text-xs w-64"/></div>
                <div className="flex-1 overflow-y-auto"><table className="w-full text-left"><thead className="bg-gray-100 text-[10px] font-bold text-gray-500 sticky top-0 z-10"><tr><th className="p-3">PRODUK</th><th className="p-3">HARGA</th><th className="p-3">KATEGORI</th><th className="p-3 text-center">AKSI</th></tr></thead><tbody className="text-xs divide-y">{displayData.map((item, idx) => (<tr key={item.id || idx} className="hover:bg-orange-50"><td className="p-3 flex items-center gap-3"><img src={item.image} className="w-8 h-8 rounded bg-gray-200 object-cover" onError={(e:any)=>e.target.src='https://via.placeholder.com/50'}/><div className="w-64"><p className="line-clamp-1 font-medium">{item.name}</p><span className={`text-[9px] px-1.5 py-0.5 rounded text-white ${item.platform==='tiktok'?'bg-black':(item.platform==='lazada'?'bg-blue-600':'bg-orange-500')}`}>{item.platform}</span></div></td><td className="p-3 font-bold">Rp{item.price.toLocaleString()}</td><td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600">{item.category}</span></td><td className="p-3 text-center flex justify-center gap-2"><button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 font-bold text-[10px] border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">✏️ EDIT</button><button onClick={() => handleDeleteProduct(item.id)} className="text-red-500 hover:text-red-700 font-bold text-[10px] border border-red-200 px-2 py-1 rounded hover:bg-red-50">🗑️</button></td></tr>))}{displayData.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada data.</td></tr>)}</tbody></table></div>
                {editingProduct && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"><h3 className="font-bold text-lg mb-4">Edit Produk</h3><div className="space-y-3"><div><label className="text-[10px] font-bold text-gray-500">Nama Produk</label><input className="w-full p-2 text-xs border rounded" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div><div><label className="text-[10px] font-bold text-gray-500">Harga</label><input type="number" className="w-full p-2 text-xs border rounded" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div><div><label className="text-[10px] font-bold text-gray-500">Kategori</label><select className="w-full p-2 text-xs border rounded" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className="text-[10px] font-bold text-gray-500">Link Affiliate</label><input className="w-full p-2 text-xs border rounded" value={editingProduct.link} onChange={e => setEditingProduct({...editingProduct, link: e.target.value})} /></div></div><div className="flex gap-2 mt-6"><button onClick={() => setEditingProduct(null)} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded">BATAL</button><button onClick={handleSaveEdit} className="flex-1 py-2 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded shadow-lg">SIMPAN PERUBAHAN</button></div></div></div>)}
            </div>
        </div>
      </div>
    </div>
  );
}