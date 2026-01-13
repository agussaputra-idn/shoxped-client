import { useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';

// === IMPORT HALAMAN ===
import Home from './pages/Home/Home';
import SecretAdmin from './pages/SecretAdmin'; 
import NotFound from './pages/NotFound/NotFound';

// === IMPORT HALAMAN BARU ===
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import VideoPage from './pages/VideoPage';

export default function useRouteElements() {
  const element = useRoutes([
    // ==========================================
    // 1. JALUR ADMIN (BERDIRI SENDIRI)
    // ==========================================
    {
      path: '/admin',
      element: <SecretAdmin />
    },
    {
      path: '/ruang-rahasia',
      element: <SecretAdmin />
    },

    // ==========================================
    // 2. JALUR USER (MAIN LAYOUT)
    // ==========================================
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'search', 
          element: <Search />
        },
        {
          path: 'wishlist', 
          element: <Wishlist />
        },
        {
          path: 'profile', 
          element: <Profile />
        },
        // --- PERBAIKAN DISINI ---
        // Kita ubah jalurnya jadi 'video-feed' agar sesuai dengan tombol Anda
        {
          path: 'video-feed', 
          element: <VideoPage />
        },
      ]
    },

    // ==========================================
    // 3. JALUR 404 (NOT FOUND)
    // ==========================================
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  return element;
}