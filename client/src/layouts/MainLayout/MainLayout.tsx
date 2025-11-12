import { Outlet } from 'react-router-dom'; // <-- PASTIKAN INI DI-IMPORT
import Footer from 'src/components/Footer/Footer';
import Header from 'src/components/Header/Header';

// Ini adalah 'pembungkus' (Header + Konten + Footer)
export default function MainLayout() {
  return (
    <div>
      <Header />

      {/* Outlet adalah 'jendela' 
        tempat React Router akan meletakkan 
        ProductList, AboutUs, atau NotFound 
      */}
      <Outlet /> 

      <Footer />
    </div>
  );
}