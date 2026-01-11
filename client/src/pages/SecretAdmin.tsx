import React, { useState, useEffect } from 'react';
import { auth, realtimeDb, db } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { collection, writeBatch, doc, getDocs, deleteDoc } from 'firebase/firestore'; 
import Papa from 'papaparse'; 

// --- HELPER: DETEKSI KATEGORI (AI V4 - Tetap Sama) ---
const detectCategory = (title: string, originalCategory: string) => {
    const tLower = title.toLowerCase();
    
    const kwSepatu = ['sepatu', 'sneakers', 'sandal', 'boots', 'shoes', 'heels', 'wedges', 'flat', 'pantofel', 'kets', 'slip on', 'loafers', 'trainers', 'running', 'sport', 'futsal', 'bola', 'crocs', 'baim', 'slop', 'sandals'];
    const kwTas = ['tas', 'bag', 'tote', 'ransel', 'dompet', 'backpack', 'clutch', 'waistbag', 'sling', 'shoulder', 'wallet', 'koper', 'duffel', 'handbag', 'selempang', 'pouch', 'travel', 'luggage'];
    const kwKecantikan = ['serum', 'skincare', 'toner', 'facial', 'sunscreen', 'lipstik', 'cream', 'lotion', 'masker', 'essence', 'moisturizer', 'foundation', 'powder', 'bedak', 'lip', 'eye', 'hair', 'shampoo', 'sabun', 'body', 'parfum', 'perfume', 'fragrance', 'beauty', 'acne', 'jerawat', 'cleanser', 'micellar', 'wardah', 'somethinc', 'skintific', 'msglow', 'scarlett'];
    const kwElektronik = ['hp', 'handphone', 'case', 'kabel', 'headset', 'charger', 'iphone', 'android', 'samsung', 'xiaomi', 'oppo', 'vivo', 'realme', 'infinix', 'laptop', 'mouse', 'keyboard', 'earphone', 'tws', 'speaker', 'bluetooth', 'powerbank', 'usb', 'monitor', 'tv', 'kamera', 'camera', 'tripod', 'watch', 'jam', 'smartwatch'];
    const kwFashion = ['baju', 'kemeja', 'dress', 'kaos', 'celana', 'rok', 'jaket', 'hoodie', 'sweater', 't-shirt', 'shirt', 'blouse', 'tunik', 'gamis', 'hijab', 'jilbab', 'batik', 'piyama', 'underwear', 'bra', 'cd', 'sarinah', 'pakaian', 'jeans', 'chino', 'kulot', 'cardigan', 'vest', 'blazer', 'setelan', 'polo', 'sock', 'kaos kaki', 'daster', 'mukena', 'ciput', 'manset'];

    if (kwSepatu.some(k => tLower.includes(k))) return "Sepatu";
    if (kwTas.some(k => tLower.includes(k))) return "Tas";
    if (kwKecantikan.some(k => tLower.includes(k))) return "Kecantikan";
    if (kwElektronik.some(k => tLower.includes(k))) return "Elektronik";
    if (kwFashion.some(k => tLower.includes(k))) return "Fashion";

    if (originalCategory && originalCategory !== "General" && originalCategory !== "") return originalCategory;
    return "Lainnya";
};

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  
  // CLIENT SIDE DATA
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState(1); 
  const ITEMS_PER_PAGE = 20;
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
        onValue(visitorsRef, (snapshot) => { setVisitorCount(snapshot.val() || 0); });
        fetchAllProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err) { alert('Login Gagal! Cek email & password.'); }
  };

  const fetchAllProducts = async () => {
    setLoadingData(true);
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(data);
        setFilteredProducts(data); 
        updateDisplay(data, 1);
        setLoadingData(false);
    } catch (error) {
        console.error("Gagal ambil data:", error);
        setLoadingData(false);
    }
  };

  // --- LOGIC SEARCH PINTAR (ANTI KERTAS) ---
  useEffect(() => {
    if (!allProducts.length) return;

    // Kalau kosong, tampilkan semua
    if (!searchTerm) {
        setFilteredProducts(allProducts);
        setPage(1);
        updateDisplay(allProducts, 1);
        return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    
    // FILTER CANGGIH PAKE REGEX
    const results = allProducts.filter((product: any) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        
        // 1. Prioritas: Cek Kategori (Misal ketik "Tas" -> Kategori Tas muncul semua)
        if (category.includes(lowerTerm)) return true;

        // 2. Cek Nama Produk dengan BATAS KATA (Word Boundary)
        // \b artinya "Mulai dari sini".
        // Jadi "tas" akan cocok dengan "Tas Selempang"
        // Tapi "tas" TIDAK cocok dengan "Kertas"
        try {
            // Regex ini mencari kata yang DIMULAI dengan search term
            const regex = new RegExp(`\\b${lowerTerm}`, 'i');
            return regex.test(name);
        } catch (e) {
            // Fallback aman kalau regex error
            return name.includes(lowerTerm); 
        }
    });

    setFilteredProducts(results);
    setPage(1); 
    updateDisplay(results, 1);
    
  }, [searchTerm, allProducts]);

  const updateDisplay = (sourceData: any[], pageNum: number) => {
     const end = pageNum * ITEMS_PER_PAGE;
     setDisplayedProducts(sourceData.slice(0, end));
  };

  const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      updateDisplay(filteredProducts, nextPage);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            const newList = allProducts.filter(p => p.id !== id);
            setAllProducts(newList); 
        } catch (error) { alert("Gagal menghapus."); }
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadLog('⏳ Membaca file CSV...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data;
        setUploadLog(`✅ Menganalisa ${rawData.length} produk...`);
        
        try {
          const batchSize = 400; 
          const chunks = [];
          
          const cleanData = rawData.map((item: any) => {
             const rawTitle = item['Title'] || '';
             const cleanId = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 50) || 'no-id';
             const finalCategory = detectCategory(rawTitle, item['Category']);

             return {
                id: cleanId,
                name: rawTitle || 'Tanpa Nama',
                price: parseInt(item['Price']) || 0,
                image: item['ItemCard__image src'] || '',
                shopeeLink: item['Affiliate Link'] || '',
                tiktokLink: '', 
                category: finalCategory, 
                sold: item['Sales'] || '0'
             };
          }).filter((item: any) => item.name !== 'Tanpa Nama' && item.price > 0);

          for (let i = 0; i < cleanData.length; i += batchSize) {
            chunks.push(cleanData.slice(i, i + batchSize));
          }

          let totalUploaded = 0;
          for (const chunk of chunks) {
            const batch = writeBatch(db);
            chunk.forEach((product: any) => {
              const docRef = doc(db, "products", product.id);
              batch.set(docRef, product); 
            });
            await batch.commit();
            totalUploaded += chunk.length;
            setUploadLog(`🚀 Uploading... ${totalUploaded} / ${cleanData.length}`);
          }

          setUploadLog(`🎉 SELESAI! Database diperbarui.`);
          setIsUploading(false);
          fetchAllProducts(); 

        } catch (error) {
          setUploadLog(`❌ Gagal: ${(error as Error).message}`);
          setIsUploading(false);
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">RESTRICTED AREA ⛔</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="Email" className="w-full p-3 rounded bg-gray-700 text-white" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full p-3 rounded bg-gray-700 text-white" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-orange-600 p-3 rounded text-white font-bold hover:bg-orange-700">UNLOCK</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">🕵️‍♂️ Secret Dashboard <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">Smart V5</span></h1>
          <button onClick={() => signOut(auth)} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold shadow">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Pengunjung</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{visitorCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Produk Aktif</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{allProducts.length.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">Ready in Memory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">📥 Import CSV (Auto AI)</h2>
                    <p className="text-xs text-gray-500 mb-4">Database akan otomatis dirapikan.</p>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-orange-50 transition cursor-pointer">
                        <input type="file" accept=".csv" onChange={handleFileUpload} disabled={isUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"/>
                        {isUploading && <p className="mt-4 text-orange-600 font-bold animate-pulse text-sm">Sedang Memproses...</p>}
                    </div>
                    {uploadLog && <div className="mt-4 p-3 bg-gray-900 text-green-400 font-mono text-xs rounded h-32 overflow-y-auto shadow-inner">{uploadLog}</div>}
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">📦 Gudang Produk ({filteredProducts.length})</h2>
                        <div className="w-full sm:w-64">
                            <input type="text" placeholder="Cari (Cth: Tas, Sepatu)..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Gambar</th>
                                    <th className="px-4 py-3">Nama Produk</th>
                                    <th className="px-4 py-3">Harga</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loadingData ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-orange-500 font-bold animate-pulse">Sedang mengambil data dari server...</td></tr>
                                ) : displayedProducts.length > 0 ? displayedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3"><img src={product.image} alt="product" className="w-10 h-10 object-cover rounded border border-gray-200" onError={(e:any) => e.target.src='https://via.placeholder.com/40'}/></td>
                                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate" title={product.name}>{product.name}</td>
                                        <td className="px-4 py-3">Rp {product.price.toLocaleString('id-ID')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                product.category === 'Sepatu' ? 'bg-orange-100 text-orange-800' :
                                                product.category === 'Tas' ? 'bg-pink-100 text-pink-800' :
                                                product.category === 'Elektronik' ? 'bg-purple-100 text-purple-800' :
                                                product.category === 'Fashion' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-200 text-gray-600'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition" title="Hapus">🗑️</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Produk tidak ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {displayedProducts.length < filteredProducts.length && (
                        <div className="p-4 border-t border-gray-100 text-center">
                             <button onClick={handleLoadMore} className="text-orange-600 font-bold text-sm hover:underline">Tampilkan {Math.min(20, filteredProducts.length - displayedProducts.length)} lagi 👇</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}