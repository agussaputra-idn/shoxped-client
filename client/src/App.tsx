import { useEffect } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { realtimeDb } from './firebase';
import useRouteElements from './useRouteElements'; 
// Import Logic Affiliate
import { useAffiliateConverter } from './hooks/useAffiliateConverter';

// --- [BARU] IMPORT PROVIDER WISHLIST ---
import { WishlistProvider } from './context/WishlistContext';

function App() {
  // 1. Panggil elemen router (Tampilan Website)
  const routeElements = useRouteElements();

  // 2. JALANKAN MESIN CUAN (Script Affiliate berjalan di background)
  useAffiliateConverter();

  // 3. Logic Live Tracking Visitor (TETAP ADA - TIDAK DIUBAH)
  useEffect(() => {
    const countVisitor = () => {
      const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
      runTransaction(visitorsRef, (currentCount) => {
        return (currentCount || 0) + 1;
      });
    };

    countVisitor();
  }, []);

  // 4. Render Tampilan Website (DIBUNGKUS PROVIDER)
  return (
    // Kita bungkus semuanya dengan WishlistProvider agar data tersimpan
    <WishlistProvider>
      <div>
        {routeElements}
      </div>
    </WishlistProvider>
  );
}

export default App;