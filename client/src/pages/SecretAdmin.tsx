import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 

/* ==================================================================================
   🔴 SECRET ADMIN - V14 (MANUAL CATEGORY OVERRIDE)
   Fitur: Dropdown Pilihan Kategori untuk memaksa jenis produk saat upload
   ================================================================================== */

// KATEGORI WAJIB SAMA PERSIS DENGAN SHOXPED
const CATEGORY_LIST = [
    "Tas Wanita", "Sepatu Wanita", "Otomotif", "Komputer & Aksesoris", "Sepatu Pria", "Aksesoris Fashion", 
    "Fashion Bayi & Anak", "Makanan & Minuman", "Pakaian Wanita", "Pakaian Pria", "Elektronik",
    "Perawatan & Kecantikan", "Handphone & Aksesoris", "Perlengkapan Rumah", "Fashion Muslim",
    // 👇 5 KATEGORI BARU DITAMBAHKAN DI SINI 👇
    "Hobi & Koleksi", "Fotografi", "Jam Tangan", "Olahraga & Outdoor", "Tas Pria" 
];

// FUNGSI DETEKSI (Hanya dipakai jika user pilih "Auto Detect")
const detectCategoryAuto = (title: string) => {
    const tLower = title.toLowerCase();
    
    // 🔥 5 KATEGORI BARU DENGAN KEYWORD SUPER LENGKAP 🔥

    // 1. FOTOGRAFI (Cegah kamera masuk ke Elektronik)
    if (tLower.includes('kamera') || tLower.includes('lensa') || tLower.includes('tripod') || tLower.includes('dslr') || tLower.includes('mirrorless') || tLower.includes('ring light') || tLower.includes('gimbal') || tLower.includes('drone') || tLower.includes('kertas foto') || tLower.includes('softbox') || tLower.includes('roll film') || tLower.includes('printer foto') || tLower.includes('tas kamera') || tLower.includes('casing kamera') || tLower.includes('battery grip') || tLower.includes('monopod') || tLower.includes('kartu memori') || tLower.includes('stabilizer') || tLower.includes('flash kamera') || tLower.includes('lighting studio') || tLower.includes('fotografi')) return "Fotografi";
    
    // 2. JAM TANGAN
    if (tLower.includes('jam tangan') || tLower.includes('arloji') || tLower.includes('smartwatch') || tLower.includes('strap jam') || tLower.includes('casio') || tLower.includes('seiko') || tLower.includes('rolex') || tLower.includes('jam dinding') || tLower.includes('jam couple') || tLower.includes('jam pria') || tLower.includes('jam wanita') || tLower.includes('kotak jam')) return "Jam Tangan";

    // 3. OLAHRAGA & OUTDOOR (Cegah sepatu futsal/bola masuk ke Sepatu Pria)
    if (tLower.includes('tenda') || tLower.includes('camping') || tLower.includes('sepeda') || tLower.includes('pancing') || tLower.includes('raket') || tLower.includes('bola ') || tLower.includes('yoga') || tLower.includes('dumbbell') || tLower.includes('jersey') || tLower.includes('olahraga') || tLower.includes('hiking') || tLower.includes('renang') || tLower.includes('kacamata renang') || tLower.includes('futsal') || tLower.includes('basket') || tLower.includes('voli') || tLower.includes('bulu tangkis') || tLower.includes('tenis') || tLower.includes('tinju') || tLower.includes('bela diri') || tLower.includes('golf') || tLower.includes('baseball') || tLower.includes('softball') || tLower.includes('billiard') || tLower.includes('selancar') || tLower.includes('diving') || tLower.includes('pilates') || tLower.includes('fitness') || tLower.includes('dart') || tLower.includes('sepatu olahraga') || tLower.includes('sepatu bola') || tLower.includes('sepatu futsal') || tLower.includes('matras yoga') || tLower.includes('panjat tebing') || tLower.includes('panahan')) return "Olahraga & Outdoor";

    // 4. HOBI & KOLEKSI (Termasuk Kebutuhan Hewan Peliharaan)
    if (tLower.includes('mainan') || tLower.includes('figure') || tLower.includes('diecast') || tLower.includes('gundam') || tLower.includes('lego') || tLower.includes('hot wheels') || tLower.includes('puzzle') || tLower.includes('gitar') || tLower.includes('alat musik') || tLower.includes('koleksi') || tLower.includes('rubik') || tLower.includes('board game') || tLower.includes('makanan kucing') || tLower.includes('makanan anjing') || tLower.includes('makanan hewan') || tLower.includes('whiskas') || tLower.includes('kandang') || tLower.includes('pasir kucing') || tLower.includes('pet shop') || tLower.includes('hewan peliharaan') || tLower.includes('grooming') || tLower.includes('cd ') || tLower.includes('dvd') || tLower.includes('bluray') || tLower.includes('piringan hitam') || tLower.includes('album foto') || tLower.includes('mesin jahit') || tLower.includes('benang rajut') || tLower.includes('action figure')) return "Hobi & Koleksi";

    // 5. TAS PRIA (Cegah ransel/tas selempang pria masuk ke Tas Wanita)
    if (tLower.includes('tas pria') || tLower.includes('ransel') || tLower.includes('waist bag') || tLower.includes('tas selempang pria') || tLower.includes('koper') || tLower.includes('backpack') || tLower.includes('tas gunung') || tLower.includes('tas bahu pria') || tLower.includes('dompet pria') || tLower.includes('tas pinggang') || tLower.includes('tas laptop') || tLower.includes('clutch pria') || tLower.includes('tote bag pria') || tLower.includes('tas kerja pria')) return "Tas Pria";


    // ⬇️ KODE BAWAAN LAMA (TIDAK ADA YANG DIUBAH) ⬇️
    if (tLower.includes('iphone') || tLower.includes('samsung') || tLower.includes('infinix') || tLower.includes('xiaomi') || tLower.includes('vivo') || tLower.includes('oppo') || tLower.includes('realme') || tLower.includes('case') || tLower.includes('casing') || tLower.includes('tempered') || tLower.includes('charger') || tLower.includes('kabel data') || tLower.includes('headset') || tLower.includes('earphone') || tLower.includes('powerbank')) return "Handphone & Aksesoris";
    if (tLower.includes('gamis') || tLower.includes('hijab') || tLower.includes('jilbab') || tLower.includes('mukena') || tLower.includes('koko') || tLower.includes('bergo') || tLower.includes('khimar') || tLower.includes('pashmina')) return "Fashion Muslim";
    if (tLower.includes('sepatu') || tLower.includes('sneakers')) return tLower.includes('wanita') ? "Sepatu Wanita" : "Sepatu Pria";
    if (tLower.includes('tas') || tLower.includes('bag') || tLower.includes('dompet')) return "Tas Wanita";
    if (tLower.includes('baju') || tLower.includes('dress') || tLower.includes('kemeja') || tLower.includes('blouse') || tLower.includes('kaos')) return "Pakaian Wanita";
    if (tLower.includes('serum') || tLower.includes('cream') || tLower.includes('sabun') || tLower.includes('skincare') || tLower.includes('lipstik') || tLower.includes('parfum')) return "Perawatan & Kecantikan";
    if (tLower.includes('bayi') || tLower.includes('anak') || tLower.includes('kids')) return "Fashion Bayi & Anak";
    if (tLower.includes('makanan') || tLower.includes('snack') || tLower.includes('kripik') || tLower.includes('basreng')) return "Makanan & Minuman";
    if (tLower.includes('tv ') || tLower.includes('televisi') || tLower.includes('kulkas') || tLower.includes('mesin cuci') || tLower.includes('kipas angin') || tLower.includes('laptop') || tLower.includes('notebook') || tLower.includes('kamera') || tLower.includes('drone') || tLower.includes('speaker') || tLower.includes('printer') || tLower.includes('proyektor')) return "Elektronik";
    if (tLower.includes('kemeja pria') || tLower.includes('kaos pria') || tLower.includes('celana pria') || tLower.includes('jaket pria') || tLower.includes('batik pria') || tLower.includes('jas') || tLower.includes('boxer') || tLower.includes('celana pendek pria') || tLower.includes('hoodie pria')) return "Pakaian Pria";
    if (tLower.includes('laptop') || tLower.includes('notebook') || tLower.includes('macbook') || tLower.includes('asus') || tLower.includes('acer') || tLower.includes('lenovo') || tLower.includes('mouse') || tLower.includes('keyboard') || tLower.includes('monitor') || tLower.includes('pc gaming') || tLower.includes('flashdisk') || tLower.includes('harddisk') || tLower.includes('ssd') || tLower.includes('ram ') || tLower.includes('vga') || tLower.includes('motherboard') || tLower.includes('printer') || tLower.includes('tinta') || tLower.includes('wifi') || tLower.includes('router') || tLower.includes('modem') || tLower.includes('pad')) return "Komputer & Aksesoris";
    if (tLower.includes('helm') || tLower.includes('motor') || tLower.includes('mobil') || tLower.includes('oli ') || tLower.includes('ban ') || tLower.includes('knalpot') || tLower.includes('spion') || tLower.includes('sarung tangan') || tLower.includes('jas hujan') || tLower.includes('aki ') || tLower.includes('kampas') || tLower.includes('busi') || tLower.includes('karburator') || tLower.includes('sticker') || tLower.includes('stiker') || tLower.includes('dashboard')) return "Otomotif";

    return "Aksesoris Fashion"; // Default terakhir
};

// Helper: Cari kolom
const findColumn = (fileKeys: string[], candidates: string[]) => {
    for (const candidate of candidates) {
        const match = fileKeys.find(k => k.toLowerCase().replace(/"/g, '').trim() === candidate.toLowerCase());
        if (match) return match;
    }
    for (const candidate of candidates) {
        const match = fileKeys.find(k => k.toLowerCase().includes(candidate.toLowerCase()));
        if (match) return match;
    }
    return null;
};

export default function SecretAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // 🔥 STATE BARU: PILIHAN KATEGORI UPLOAD
  const [selectedUploadCategory, setSelectedUploadCategory] = useState('Auto Detect');

  const totalProducts = accumulatedProducts.length;
  const shopeeCount = accumulatedProducts.filter(p => p.platform === 'shopee').length;
  const tiktokCount = accumulatedProducts.filter(p => p.platform === 'tiktok').length;
  const lazadaCount = accumulatedProducts.filter(p => p.platform === 'lazada').length;

  const [manualProduct, setManualProduct] = useState({
      name: '', price: '', image: '', link: '', category: 'Tas Wanita', sold: '0', platform: 'shopee'
  });

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
      return text.replace(/<[^>]*>?/gm, '').replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
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

  // --- V14: UPLOAD WITH CATEGORY OVERRIDE ---
  const handleCsvUpload = async (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    let totalNewItems: any[] = [];
    let failedReports: string[] = [];
    
    const candidates = {
        title: ['whitespace-normal', 'merchant product name', 'product name', 'nama produk', 'title', 'name'],
        link: ['contents href', 'product url mobile (encoded)', 'product url web (encoded)', 'click_url', 'link', 'url'],
        image: ['inset-y-0 src', 'image url', 'primary_image_url', 'itemcard__image src', 'image', 'img'],
        price: ['font-medium 2', 'discounted price', 'sale_price', 'price', 'harga'],
        sold: ['truncate 3', 'item_sold', 'sales', 'sold', 'terjual', 'truncate 2'], 
        cat: ['main category name', 'category name', 'kategori'],
        merchantId: ['merchant product id', 'product id']
    };
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const sniffDelimiter = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const firstLine = text.split('\n')[0];
                const commaCount = (firstLine.match(/,/g) || []).length;
                const semiCount = (firstLine.match(/;/g) || []).length;
                resolve(commaCount > semiCount ? "," : ";");
            };
            reader.readAsText(file.slice(0, 5000));
        });

        await new Promise<void>((resolve) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: sniffDelimiter, 
                transformHeader: (h) => h.trim().replace(/[\ufeff]/g, '').replace(/^"|"$/g, ''),
                complete: (results) => {
                    const rawData = results.data;
                    if (rawData.length === 0) { resolve(); return; }

                    const keys = Object.keys(rawData[0] as any);
                    let colTitle = findColumn(keys, candidates.title);
                    let colLink = findColumn(keys, candidates.link);

                    if (!colTitle || !colLink) {
                        failedReports.push(`File: ${file.name} - Gagal Deteksi Kolom Title/Link`);
                        resolve(); return;
                    }

                    let colImage = findColumn(keys, candidates.image);
                    let colPrice = findColumn(keys, candidates.price);
                    let colSold = findColumn(keys, candidates.sold);
                    let colCat = findColumn(keys, candidates.cat);
                    let colMerchantId = findColumn(keys, candidates.merchantId);

                    rawData.forEach((item: any) => {
                        const rawTitle = cleanText(item[colTitle!] || '');
                        if (rawTitle.length < 2) return; 

                        let rawPrice = item[colPrice!] || '0';
                        if (typeof rawPrice === 'string') rawPrice = rawPrice.replace(/[^0-9]/g, ''); 
                        const finalPrice = parseInt(rawPrice) || 0;

                        let finalImage = item[colImage!] || '';
                        if(!finalImage && item['w-full src']) finalImage = item['w-full src']; 
                        if(!finalImage && item['max-w-none src']) finalImage = item['max-w-none src']; 
                        
                        // 🔥 LOGIKA KATEGORI V14 🔥
                        let finalCategory = "Aksesoris Fashion";
                        
                        if (selectedUploadCategory !== 'Auto Detect') {
                            // 1. JIKA USER PILIH MANUAL -> PAKSA PAKAI ITU
                            finalCategory = selectedUploadCategory;
                        } else {
                            // 2. JIKA AUTO -> DETEKSI DARI JUDUL
                            const catFromFile = colCat ? item[colCat] : "";
                            finalCategory = detectCategoryAuto(rawTitle);
                        }
                        
                        let platform = 'shopee';
                        if (file.name.toLowerCase().includes('lazada')) platform = 'lazada';
                        if (file.name.toLowerCase().includes('tiktok')) platform = 'tiktok';

                        let docId = item[colMerchantId!] || Math.random().toString(36).substr(2, 9);

                        totalNewItems.push({
                            id: docId, name: rawTitle, price: finalPrice, image: finalImage,
                            link: item[colLink!] || '', category: finalCategory, 
                            sold: colSold ? (item[colSold] || 'Laris') : 'Laris',
                            platform: platform, createdAt: new Date().toISOString()
                        });
                    });
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    const allCandidates = [...accumulatedProducts, ...totalNewItems];
    const uniqueItems: any[] = [];
    const seenKeys = new Set();
    let dupeCount = 0;

    allCandidates.forEach(item => {
        const key = `${item.name.toLowerCase().trim()}-${item.price}`;
        if (!seenKeys.has(key)) { seenKeys.add(key); uniqueItems.push(item); } else { dupeCount++; }
    });

    setAccumulatedProducts(uniqueItems);
    setIsUploading(false);

    if (totalNewItems.length > 0) {
        alert(`✅ IMPOR SUKSES!\nKategori Dipilih: ${selectedUploadCategory}\nProduk Masuk: ${totalNewItems.length}\nDuplikat: ${dupeCount}`);
    } else {
        alert(`❌ GAGAL! Laporan:\n${failedReports.join('\n')}`);
    }
  };

  const handleJsonUpload = (event: any) => { /* Sama seperti sebelumnya */ };

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
            <h1 className="text-xl font-black text-slate-800 uppercase">Secret<span className="text-orange-600">Admin</span> V14</h1>
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
                    <h3 className="font-bold text-sm mb-4">2. IMPORT DATA (ALL-IN-ONE)</h3>
                    
                    {/* 🔥 FITUR BARU: PILIH KATEGORI 🔥 */}
                    <div className="mb-4">
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">TENTUKAN KATEGORI FILE INI:</label>
                        <select 
                            value={selectedUploadCategory} 
                            onChange={(e) => setSelectedUploadCategory(e.target.value)}
                            className="w-full p-2 text-xs border border-orange-300 rounded bg-orange-50 font-bold text-orange-800"
                        >
                            <option value="Auto Detect">⚡ Auto Detect (Sesuai Judul)</option>
                            {CATEGORY_LIST.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 bg-orange-50 border border-orange-200 p-3 rounded-lg cursor-pointer hover:bg-orange-100">
                            <span className="text-xl">📂</span>
                            <span className="text-xs font-bold text-orange-800">Upload CSV</span>
                            <input type="file" accept=".csv" multiple onChange={handleCsvUpload} disabled={isUploading} className="hidden"/>
                        </label>
                    </div>
                    {isUploading && <p className="text-xs text-center mt-2 text-blue-600 font-bold animate-pulse">Sedang Memproses...</p>}
                </div>
                
                {/* Bagian Input Manual & Tabel (Kode disingkat, isi tetap sama seperti V13) */}
                 <div className="bg-white p-6 rounded-2xl shadow border"><h3 className="font-bold text-sm mb-4">3. INPUT MANUAL</h3><form onSubmit={handleManualSubmit} className="space-y-3"><input type="text" placeholder="Nama Produk" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.name} onChange={e => setManualProduct({...manualProduct, name: e.target.value})} required /><input type="number" placeholder="Harga" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.price} onChange={e => setManualProduct({...manualProduct, price: e.target.value})} required /><select className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.category} onChange={e => setManualProduct({...manualProduct, category: e.target.value})}>{CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select><input type="text" placeholder="Link Produk" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.link} onChange={e => setManualProduct({...manualProduct, link: e.target.value})} required /><input type="text" placeholder="Link Gambar" className="w-full p-2 text-xs border rounded bg-gray-50" value={manualProduct.image} onChange={e => setManualProduct({...manualProduct, image: e.target.value})} required /><button className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">TAMBAH ITEM</button></form></div>
            </div>
             <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-hidden flex flex-col h-[800px] relative">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold text-sm">DAFTAR PRODUK ({accumulatedProducts.length})</h3><input type="text" placeholder="Cari Judul / Kategori..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-3 py-1.5 rounded-lg border text-xs w-64"/></div>
                <div className="flex-1 overflow-y-auto"><table className="w-full text-left"><thead className="bg-gray-100 text-[10px] font-bold text-gray-500 sticky top-0 z-10"><tr><th className="p-3">PRODUK</th><th className="p-3">HARGA</th><th className="p-3">KATEGORI</th><th className="p-3 text-center">AKSI</th></tr></thead><tbody className="text-xs divide-y">{displayData.map((item, idx) => (<tr key={item.id || idx} className="hover:bg-orange-50"><td className="p-3 flex items-center gap-3"><img src={item.image} className="w-8 h-8 rounded bg-gray-200 object-cover" onError={(e:any)=>e.target.src='https://via.placeholder.com/50'}/><div className="w-64"><p className="line-clamp-1 font-medium">{item.name}</p><span className={`text-[9px] px-1.5 py-0.5 rounded text-white ${item.platform==='tiktok'?'bg-black':(item.platform==='lazada'?'bg-blue-600':'bg-orange-500')}`}>{item.platform}</span></div></td><td className="p-3 font-bold">Rp{item.price.toLocaleString()}</td><td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600">{item.category}</span></td><td className="p-3 text-center flex justify-center gap-2"><button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 font-bold text-[10px] border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">✏️ EDIT</button><button onClick={() => handleDeleteProduct(item.id)} className="text-red-500 hover:text-red-700 font-bold text-[10px] border border-red-200 px-2 py-1 rounded hover:bg-red-50">🗑️</button></td></tr>))}{displayData.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada data.</td></tr>)}</tbody></table></div>
                {editingProduct && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"><h3 className="font-bold text-lg mb-4">Edit Produk</h3><div className="space-y-3"><div><label className="text-[10px] font-bold text-gray-500">Nama Produk</label><input className="w-full p-2 text-xs border rounded" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div><div><label className="text-[10px] font-bold text-gray-500">Harga</label><input type="number" className="w-full p-2 text-xs border rounded" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div><div><label className="text-[10px] font-bold text-gray-500">Kategori</label><select className="w-full p-2 text-xs border rounded" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>{CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className="text-[10px] font-bold text-gray-500">Link Affiliate</label><input className="w-full p-2 text-xs border rounded" value={editingProduct.link} onChange={e => setEditingProduct({...editingProduct, link: e.target.value})} /></div></div><div className="flex gap-2 mt-6"><button onClick={() => setEditingProduct(null)} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded">BATAL</button><button onClick={handleSaveEdit} className="flex-1 py-2 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded shadow-lg">SIMPAN PERUBAHAN</button></div></div></div>)}
            </div>
        </div>
      </div>
    </div>
  );
}