import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// IMPORT HALAMAN YANG TERSISA
import ProductList from './pages/ProductList/ProductList';
import NotFound from './pages/NotFound/NotFound';
import AboutUs from './pages/AboutUs/AboutUs'; 
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home'; // <-- IMPORT HALAMAN BARU

export default function useRouteElements() {
  const element = useRoutes([
    {
      // Rute Induk (/)
      path: path.home,
      element: <MainLayout />, // Gunakan Layout (Header/Footer)
      
      children: [ 
        {
          index: true, // Halaman default (http://localhost:3000/)
          element: <Home /> // <-- SEKARANG MENAMPILKAN HALAMAN HOME
        },
        {
          path: path.aboutUs, // Path: /about-us
          element: <AboutUs />
        },
        {
          // --- HALAMAN PRODUK DUMMY PINDAH KE SINI ---
          path: path.search, // Path: /search
          element: <ProductList />
        }
      ]
    },
    {
      // Path 404 (Halaman Tidak Ditemukan)
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