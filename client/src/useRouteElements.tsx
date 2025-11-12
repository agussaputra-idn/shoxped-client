import { useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';

// IMPORT HALAMAN YANG TERSISA
import ProductList from './pages/ProductList/ProductList';
import NotFound from './pages/NotFound/NotFound';
import AboutUs from './pages/AboutUs/AboutUs'; 
import MainLayout from './layouts/MainLayout/MainLayout';

// (Fungsi 'MainRoute' yang membingungkan sudah dihapus)

export default function useRouteElements() {
  const element = useRoutes([
    {
      // Rute Induk (/)
      // Kita langsung gunakan MainLayout (yang sudah punya <Outlet />)
      path: path.home,
      element: <MainLayout />, 

      // "Anak-anak" ini akan dirender di dalam <Outlet /> MainLayout
      children: [ 
        {
          index: true, // Halaman default (http://localhost:3000/)
          element: <ProductList />
        },
        {
          path: path.aboutUs, // Path: /about-us
          element: <AboutUs />
        },
        // (Anda bisa tambahkan path halaman statis lain di sini nanti)
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