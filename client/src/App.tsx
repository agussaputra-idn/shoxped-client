import { useEffect } from 'react';
import { ref, runTransaction } from 'firebase/database';
// 👇 Perhatikan: kita import 'realtimeDb', bukan 'db' lagi
import { realtimeDb } from './firebase'; 

function App() {

  useEffect(() => {
    // Fungsi pencatat pengunjung
    const countVisitor = () => {
      // 👇 Pakai realtimeDb di sini
      const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
      
      runTransaction(visitorsRef, (currentCount) => {
        // Kalau null (data baru), jadi 1. Kalau ada, tambah 1.
        return (currentCount || 0) + 1;
      });
    };

    countVisitor();
  }, []);

  return (
    // ... Biarkan kode HTML/Router di bawah ini apa adanya ...
    // Pastikan tidak menghapus isi return yang sudah ada
  );
}

export default App;