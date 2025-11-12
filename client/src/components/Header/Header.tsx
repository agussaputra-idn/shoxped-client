// (Import 'useContext' dan 'AuthContext' sudah dihapus)
// (Import 'usePurchases' dan 'Popover' keranjang sudah dihapus)
import { Link } from 'react-router-dom';
import useSearchProduct from 'src/hooks/useSearchProduct';
import Navbar from '../Navbar/Navbar';

export default function Header() {
  // (Logika 'isAuthenticated' dan 'purchasesInCart' sudah dihapus)
  const { onSubmitSearch, register } = useSearchProduct();

  return (
    // Warna header (primary = Oranye)
    <div className='bg-primary pb-5 pt-2 text-white'>
      <div className='container'>
        <Navbar />
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          {/* Logo "Shoxped" */}
          <Link to='/' className='col-span-2 flex h-11 items-center'>
            <div className='text-3xl font-bold text-white'>Shoxped</div>
          </Link>

          {/* Form Pencarian */}
          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Search for products, brands and shops...'
                {...register('name')}
              />
              <button className='flex-shrink-0 rounded-sm bg-primary py-2 px-6 hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* === IKON KERANJANG (DIHAPUS) === */}
          {/* Ikon keranjang (Popover) sengaja dihapus
            karena Shoxped tidak memiliki fitur keranjang.
          */}

        </div>
      </div>
    </div>
  );
}