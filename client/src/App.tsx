import { useEffect } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { realtimeDb } from './firebase';
import useRouteElements from './useRouteElements'; // 👈 Kembalikan fungsi Router ini

function App() {
  // 1. Panggil elemen router Anda
  const routeElements = useRouteElements();

  // 2. Logic Live Tracking Visitor (JANGAN DIHAPUS)
  useEffect(() => {
    const countVisitor = () => {
      const visitorsRef = ref(realtimeDb, 'stats/totalVisitors');
      runTransaction(visitorsRef, (currentCount) => {
        return (currentCount || 0) + 1;
      });
    };

    countVisitor();
  }, []);

  // 3. Render Tampilan Website (INI YANG TADI HILANG)
  return (
    <div>
      {routeElements}
    </div>
  );
}

export default App;