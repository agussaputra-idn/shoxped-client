import React, { useState, useEffect } from 'react';
// 👇 UBAH 1: Import realtimeDb (bukan db)
import { auth, realtimeDb } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// 👇 UBAH 2: Import fungsi Realtime Database (bukan Firestore)
import { ref, onValue } from 'firebase/database'; 

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 👇 UBAH 3: State khusus untuk counter angka
  const [visitorCount, setVisitorCount] = useState(0);

  // Cek Login & Pasang Live Tracking
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Jika user sudah login, langsung aktifkan "Mata-Mata"
      if (currentUser) {
        // 👇 LOGIKA BARU: Dengar perubahan dari Realtime Database
        const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
        onValue(visitorsRef, (snapshot) => {
          const data = snapshot.val();
          setVisitorCount(data || 0);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Login (Tetap Sama)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Akses Ditolak! Email atau Password Salah.');
    }
  };

  // Fungsi Logout (Tetap Sama)
  const handleLogout = async () => {
    await signOut(auth);
  };

  // TAMPILAN JIKA BELUM LOGIN (Gerbang Besi) - Tetap Sama
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">RESTRICTED AREA ⛔</h2>
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm text-center">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <input 
              type="password" 
              placeholder="Secure Password" 
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded transition-all">
              UNLOCK SYSTEM
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TAMPILAN JIKA SUDAH LOGIN (Dashboard Admin)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🕵️‍♂️ Secret Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Lock & Exit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Visitors</h3>
            {/* 👇 Tampilkan Angka Realtime di sini */}
            <p className="text-4xl font-bold text-gray-900 mt-2">{visitorCount}</p>
            <span className="text-green-500 text-sm">● Live Tracking Active</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium uppercase">System Status</h3>
            <p className="text-lg font-semibold text-gray-800 mt-2">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}