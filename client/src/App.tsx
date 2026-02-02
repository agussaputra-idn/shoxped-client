import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';

// Import Komponen Navigasi
import BottomNav from './components/BottomNav/BottomNav';

// Import Halaman
import Home from './pages/Home/Home';
import SecretAdmin from './pages/SecretAdmin';
import Search from './pages/Search';
import VideoPage from './pages/VideoPage';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();
  
  // Logika agar BottomNav TIDAK muncul di halaman Admin (ruang-rahasia)
  const showBottomNav = location.pathname !== '/ruang-rahasia';

  return (
    <div className="min-h-screen bg-white">
      {/* Jika bukan halaman admin, beri padding bawah agar konten tidak tertutup Nav */}
      <div className={showBottomNav ? "pb-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ruang-rahasia" element={<SecretAdmin />} />
        </Routes>
      </div>

      {/* Tampilkan BottomNav hanya jika bukan di ruang-rahasia */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <WishlistProvider>
      <AppContent />
    </WishlistProvider>
  );
}

export default App;