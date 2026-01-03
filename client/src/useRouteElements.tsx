import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// === IMPORT HALAMAN ===
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import Compare from './pages/Compare/Compare';
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
          element: <ProductList />
        },
        {
          // 🔥 ROUTE COMPARE (PAKAI CONSTANT)
          path: path.compare,
          element: <Compare />
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
