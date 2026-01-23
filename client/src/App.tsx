import { useEffect } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { realtimeDb } from './firebase';
import useRouteElements from './useRouteElements'; 
// Import Logic Affiliate Baru
import { useAffiliateConverter } from './hooks/useAffiliateConverter';

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

  // 4. Render Tampilan Website (TETAP SAMA)
  return (
    <div>
      {routeElements}
    </div>
  );
}

export default App;