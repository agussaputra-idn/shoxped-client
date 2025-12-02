import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// === IMPORT HALAMAN (Pastikan semua ada) ===
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import AboutUs from './pages/AboutUs/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'; // <--- Import baru
import Terms from './pages/Terms/Terms'; // <--- Import baru
import NotFound from './pages/NotFound/NotFound';

export default function useRouteElements() {
  const element = useRoutes([
    {
      path: path.home,
      element: <MainLayout />, // Gunakan bingkai utama (Header + Footer)
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: path.search,
          element: <ProductList />
        },
        {
          path: path.aboutUs,
          element: <AboutUs />
        },
        // === PENDAFTARAN RUTE BARU ===
        {
          path: path.privacyPolicy,
          element: <PrivacyPolicy />
        },
        {
          path: path.terms,
          element: <Terms />
        },
        // =============================
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