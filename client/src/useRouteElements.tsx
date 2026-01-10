import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// === IMPORT HALAMAN ===
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Search from './pages/Search'; 

// IMPORT HALAMAN RAHASIA (Pastikan file src/pages/SecretAdmin.tsx sudah dibuat)
import SecretAdmin from './pages/SecretAdmin';

import AboutUs from './pages/AboutUs/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Terms from './pages/Terms/Terms';
import NotFound from './pages/NotFound/NotFound';

export default function useRouteElements() {
  const element = useRoutes([
    // 1. JALUR RAHASIA (Ditaruh diluar MainLayout agar tanpa Header/Footer)
    {
      path: '/ruang-rahasia', // <-- Ganti ini jika ingin URL yang lebih sulit ditebak
      element: <SecretAdmin />
    },

    // 2. JALUR UTAMA WEBSITE
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

    // 3. HALAMAN NOT FOUND (404)
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