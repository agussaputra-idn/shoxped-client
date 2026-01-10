import React, { useState, useEffect } from 'react';
import { auth, realtimeDb, db } from '../firebase'; // Pastikan db (Firestore) diimport
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore'; // Fitur Database Produk
import Papa from 'papaparse'; // Alat baca CSV

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  
  // State untuk Upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState('');

  // 1. Cek Login & Visitor (Sama seperti sebelumnya)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
        onValue(visitorsRef, (snapshot) => {
          setVisitorCount(snapshot.val() || 0);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert('Login Gagal! Cek email & password.');
    }
  };

  // 3. JURUS RAHASIA: Import CSV ke Firestore
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
        setUploadLog(`✅ File terbaca! Ditemukan ${rawData.length} baris data. Mulai memproses...`);
        
        try {
          // Batch write (Firestore membatasi 500 data per batch, jadi kita potong-potong)
          const batchSize = 400; 
          const chunks = [];
          
          // Bersihkan Data & Mapping Kolom CSV Anda
          const cleanData = rawData.map((item: any) => ({
            id: item['Title']?.replace(/\s+/g, '-').toLowerCase().substring(0, 50) || 'no-id', // Bikin ID unik dari judul
            name: item['Title'] || 'Tanpa Nama',
            price: parseInt(item['Price']) || 0,
            image: item['ItemCard__image src'] || '',
            shopeeLink: item['Affiliate Link'] || '',
            tiktokLink: '', // Kosongkan dulu karena di CSV cuma ada 1 link
            category: item['Category'] || 'General',
            sold: item['Sales'] || '0'
          })).filter((item: any) => item.name !== 'Tanpa Nama' && item.price > 0);

          // Bagi data menjadi paket-paket kecil
          for (let i = 0; i < cleanData.length; i += batchSize) {
            chunks.push(cleanData.slice(i, i + batchSize));
          }

          let totalUploaded = 0;

          // Kirim paket ke Firebase
          for (const chunk of chunks) {
            const batch = writeBatch(db);
            chunk.forEach((product: any) => {
              const docRef = doc(db, "products", product.id); // "products" adalah nama tabelnya
              batch.set(docRef, product);
            });
            await batch.commit();
            totalUploaded += chunk.length;
            setUploadLog(`🚀 Mengupload... ${totalUploaded} / ${cleanData.length} produk berhasil disimpan.`);
          }

          setUploadLog(`🎉 SUKSES! Total ${totalUploaded} produk sudah masuk database Shoxped.`);
          setIsUploading(false);

        } catch (error) {
          console.error(error);
          setUploadLog(`❌ Gagal Upload: ${(error as Error).message}`);
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
                <button className="w-full bg-orange-600 p-3 rounded text-white font-bold">UNLOCK</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🕵️‍♂️ Secret Dashboard</h1>
          <button onClick={() => signOut(auth)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold">TOTAL VISITORS</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">{visitorCount}</p>
            <p className="text-green-500 text-xs mt-1">● Live Tracking Active</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-bold">DATABASE STATUS</h3>
            <p className="text-lg font-semibold text-gray-800 mt-2">Ready to Import</p>
            <p className="text-gray-400 text-xs mt-1">Firestore Connected</p>
          </div>
        </div>

        {/* AREA UPLOAD CSV */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📥 Import Massal Produk</h2>
            <p className="text-gray-600 mb-6">Upload file CSV database produk Anda di sini. Sistem akan otomatis membersihkan duplikat.</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 hover:bg-gray-100 transition">
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {isUploading && <p className="mt-4 text-blue-600 font-semibold animate-pulse">Sedang memproses... Jangan tutup halaman!</p>}
            </div>

            {/* LOG OUTPUT */}
            {uploadLog && (
                <div className="mt-6 p-4 bg-black text-green-400 font-mono text-sm rounded h-40 overflow-y-auto">
                    {uploadLog}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}