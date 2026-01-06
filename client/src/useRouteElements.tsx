import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// === IMPORT HALAMAN ===
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';

// 1. IMPORT FILE SEARCH YANG BARU
// Pastikan filenya sudah dibuat di src/pages/Search.tsx
import Search from './pages/Search'; 

// Hapus atau abaikan ProductList yang lama karena itu sumber masalahnya
// import ProductList from './pages/ProductList/ProductList'; 

import AboutUs from './pages/AboutUs/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Terms from './pages/Terms/Terms';
import NotFound from './pages/NotFound/NotFound';

export default function useRouteElements() {
  const element = useRoutes([
    {
      path: path.home,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: path.search,
          // 2. GUNAKAN SEARCH DISINI (Bukan ProductList)
          element: <Search />
        },
        {
          path: path.aboutUs,
          element: <AboutUs />
        },
        {
          path: path.privacyPolicy,
          element: <PrivacyPolicy />
        },
        {
          path: path.terms,
          element: <Terms />
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ]);

  return element;
}