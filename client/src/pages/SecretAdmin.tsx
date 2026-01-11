import React, { useState, useEffect } from 'react';
import { auth, realtimeDb, db } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { 
  collection, writeBatch, doc, getDocs, deleteDoc, 
  query, limit, startAfter, where, getCountFromServer, orderBy 
} from 'firebase/firestore'; 
import Papa from 'papaparse'; 

// --- HELPER: TEBAK KATEGORI (LEBIH AGRESIF) ---
// Kita pakai .includes() saja biar lebih tajam mendeteksi kata
const detectCategory = (title: string, originalCategory: string) => {
    const tLower = title.toLowerCase();
    
    // Kamus Kata Kunci
    const kwSepatu = ['sepatu', 'sneakers', 'sandal', 'boots', 'shoes', 'heels', 'wedges', 'flat', 'pantofel', 'kets', 'slip on', 'loafers', 'trainers', 'running', 'sport', 'futsal', 'bola', 'crocs', 'baim', 'slop'];
    const kwTas = ['tas', 'bag', 'tote', 'ransel', 'dompet', 'backpack', 'clutch', 'waistbag', 'sling', 'shoulder', 'wallet', 'koper', 'duffel', 'handbag', 'selempang', 'pouch', 'travel bag'];
    const kwKecantikan = ['serum', 'skincare', 'toner', 'facial', 'sunscreen', 'lipstik', 'cream', 'lotion', 'masker', 'essence', 'moisturizer', 'foundation', 'powder', 'bedak', 'lip', 'eye', 'hair', 'shampoo', 'sabun', 'body', 'parfum', 'perfume', 'fragrance', 'beauty', 'acne', 'jerawat', 'cleanser', 'micellar', 'wardah', 'somethinc', 'skintific'];
    const kwElektronik = ['hp', 'handphone', 'case', 'kabel', 'headset', 'charger', 'iphone', 'android', 'samsung', 'xiaomi', 'oppo', 'vivo', 'realme', 'infinix', 'laptop', 'mouse', 'keyboard', 'earphone', 'tws', 'speaker', 'bluetooth', 'powerbank', 'usb', 'monitor', 'tv', 'kamera', 'camera', 'tripod', 'watch', 'jam tangan'];
    const kwFashion = ['baju', 'kemeja', 'dress', 'kaos', 'celana', 'rok', 'jaket', 'hoodie', 'sweater', 't-shirt', 'shirt', 'blouse', 'tunik', 'gamis', 'hijab', 'jilbab', 'batik', 'piyama', 'underwear', 'bra', 'cd', 'sarinah', 'pakaian', 'jeans', 'chino', 'kulot', 'cardigan', 'vest', 'blazer', 'setelan', 'polo', 'sock', 'kaos kaki'];

    // Cek satu per satu (Prioritas)
    if (kwSepatu.some(k => tLower.includes(k))) return "Sepatu";
    if (kwTas.some(k => tLower.includes(k))) return "Tas";
    if (kwKecantikan.some(k => tLower.includes(k))) return "Kecantikan";
    if (kwElektronik.some(k => tLower.includes(k))) return "Elektronik";
    if (kwFashion.some(k => tLower.includes(k))) return "Fashion";

    // Kalau tidak ketemu, baru pakai kategori asli dari CSV (atau Lainnya)
    if (originalCategory && originalCategory !== "General") return originalCategory;
    return "Lainnya";
};

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [products, setProducts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
        onValue(visitorsRef, (snapshot) => {
          setVisitorCount(snapshot.val() || 0);
        });
        fetchStats();
        fetchProducts(); 
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err) { alert('Login Gagal! Cek email & password.'); }
  };

  const fetchStats = async () => {
    try {
        const coll = collection(db, "products");
        const snapshot = await getCountFromServer(coll);
        setTotalProducts(snapshot.data().count);
    } catch (e) { console.log("Gagal hitung total:", e); }
  };

  // --- LOGIC FETCH DATA (SEARCH & LOAD MORE) ---
  const fetchProducts = async (isLoadMore = false) => {
    setLoadingData(true);
    try {
        let q;
        const productsRef = collection(db, "products");

        if (searchTerm) {
             // Search Logic
             q = query(
                 productsRef, 
                 where("name", ">=", searchTerm), 
                 where("name", "<=", searchTerm + '\uf8ff'), 
                 limit(20)
             );
        } else {
             // Default Load (pake OrderBy biar rapi)
             if (isLoadMore && lastDoc) {
                q = query(productsRef, limit(20), startAfter(lastDoc));
             } else {
                q = query(productsRef, limit(20));
             }
        }

        const querySnapshot = await getDocs(q);
        const data: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (isLoadMore) {
            // Kalau load more, gabung data lama + baru
            setProducts(prev => [...prev, ...data]);
        } else {
            // Kalau search baru / awal, GANTI total data
            setProducts(data);
        }

        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setLoadingData(false);
    } catch (error) {
        console.error("Gagal ambil data:", error);
        setLoadingData(false);
    }
  };

  // Wrapper khusus untuk Tombol Cari biar bersih
  const handleSearchClick = () => {
      setProducts([]); // Kosongkan tabel dulu (Visual Feedback)
      setLastDoc(null); // Reset halaman
      fetchProducts(false); // Ambil data baru
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            setProducts(products.filter(p => p.id !== id));
            setTotalProducts(prev => prev - 1);
        } catch (error) { alert("Gagal menghapus."); }
    }
  };

  // --- LOGIC UPLOAD SUPER AGRESIF ---
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
          
          // Debugging Counter
          let countSepatu = 0;
          let countTas = 0;

          const cleanData = rawData.map((item: any) => {
             const rawTitle = item['Title'] || '';
             const cleanId = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 50) || 'no-id';

             // DETEKSI KATEGORI (Auto Detect)
             const finalCategory = detectCategory(rawTitle, item['Category']);

             // Hitung untuk log
             if (finalCategory === 'Sepatu') countSepatu++;
             if (finalCategory === 'Tas') countTas++;

             return {
                id: cleanId,
                name: rawTitle || 'Tanpa Nama',
                price: parseInt(item['Price']) || 0,
                image: item['ItemCard__image src'] || '',
                shopeeLink: item['Affiliate Link'] || '',
                tiktokLink: '', 
                category: finalCategory, // Hasil deteksi paksa
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
              batch.set(docRef, product); // Timpa data lama
            });
            await batch.commit();
            totalUploaded += chunk.length;
            setUploadLog(`🚀 Uploading... ${totalUploaded} / ${cleanData.length} (Terdeteksi: ${countSepatu} Sepatu, ${countTas} Tas)`);
          }

          setUploadLog(`🎉 SELESAI! Database diperbarui. ${countSepatu} Sepatu & ${countTas} Tas berhasil dikategorikan.`);
          setIsUploading(false);
          fetchStats(); 
          fetchProducts(); 

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
          <h1 className="text-3xl font-bold text-gray-800">🕵️‍♂️ Secret Dashboard <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded ml-2">Smart V4</span></h1>
          <button onClick={() => signOut(auth)} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold shadow">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Pengunjung</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{visitorCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Produk di Gudang</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{totalProducts.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">📥 Import CSV (Force Update)</h2>
                    <p className="text-xs text-gray-500 mb-4">Otomatis memperbaiki kategori "General" jadi Sepatu/Tas.</p>
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
                        <h2 className="text-lg font-bold text-gray-800">📦 Manajemen Produk</h2>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <input type="text" placeholder="Cari (Case Sensitive)..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                            <button onClick={handleSearchClick} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600">Cari</button>
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
                                {products.length > 0 ? products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3"><img src={product.image} alt="product" className="w-10 h-10 object-cover rounded border border-gray-200" onError={(e:any) => e.target.src='https://via.placeholder.com/40'}/></td>
                                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate" title={product.name}>{product.name}</td>
                                        <td className="px-4 py-3">Rp {product.price.toLocaleString('id-ID')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                product.category === 'Sepatu' ? 'bg-orange-100 text-orange-800' :
                                                product.category === 'Tas' ? 'bg-pink-100 text-pink-800' :
                                                product.category === 'Elektronik' ? 'bg-purple-100 text-purple-800' :
                                                product.category === 'Kecantikan' ? 'bg-red-100 text-red-800' :
                                                product.category === 'General' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition" title="Hapus">🗑️</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{loadingData ? "Sedang memuat data..." : "Tidak ada produk ditemukan."}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 text-center">
                         <button onClick={() => fetchProducts(true)} disabled={loadingData || !lastDoc} className="text-orange-600 font-bold text-sm hover:underline disabled:opacity-50">{loadingData ? "Loading..." : "Muat Lebih Banyak 👇"}</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}