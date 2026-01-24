import { useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';

// === IMPORT HALAMAN UTAMA ===
import Home from './pages/Home/Home';
import SecretAdmin from './pages/SecretAdmin'; 
import NotFound from './pages/NotFound/NotFound';

// === IMPORT HALAMAN FITUR ===
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import VideoPage from './pages/VideoPage';

// === IMPORT HALAMAN LEGAL (BARU DITAMBAHKAN) ===
// Pastikan di dalam folder ini nama filenya adalah 'index.tsx' atau 'AboutUs.tsx'
import AboutUs from './pages/AboutUs'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

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
        {
          path: 'video-feed', 
          element: <VideoPage />
        },

        // --- RUTE LEGAL BARU (DITAMBAHKAN DI SINI) ---
        {
          path: 'about-us', 
          element: <AboutUs />
        },
        {
          path: 'privacy-policy', 
          element: <PrivacyPolicy />
        },
        {
          path: 'terms-conditions', 
          element: <Terms />
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