import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';
import useSearchProduct from 'src/hooks/useSearchProduct';
import Navbar from '../Navbar/Navbar';
import Popover from '../Popover/Popover';
import { path } from 'src/constants/path';
import { formatCurrency } from 'src/utils/helper';
import noproduct from '../../assets/images/no-product.png';
import { usePurchases } from 'src/hooks/usePurchases';

const MAX_PURCHASES = 5;

export default function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const { onSubmitSearch, register } = useSearchProduct();

  const { data: purchasesInCartData } = usePurchases();
  const purchasesInCart = purchasesInCartData?.data;

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
          {/* ==================================== */}

          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Search for products, brands and shops...'
                {...register('name')}
              />
              {/* Tombol cari (primary = Oranye) */}
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
          <div className='col-span-1 justify-self-end'>
            <div>
              <Popover
                renderPopover={
                  <div className='relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                    {purchasesInCart && purchasesInCart.length > 0 ? (
                      <div className='p-2'>
                        <div className='capitalize text-gray-400'>Recently Added Products</div>
                        <div className='mt-5'>
                          {isAuthenticated ? (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            purchasesInCart.slice(0, MAX_PURCHASES).map((purchase: any) => (
                              <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                                <div className='flex-shrink-0'>
                                  <img
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                    className='h-11 w-11 object-cover'
                                  />
                                </div>
                                <div className='ml-2 flex-grow overflow-hidden'>
                                  <div className='truncate'>{purchase.product.name}</div>
                                </div>
                                <div className='ml-2 flex-shrink-0'>
                                  {/* Teks harga (primary = Oranye) */}
                                  <span className='text-primary'>${formatCurrency(purchase.product.price)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className='mt-6 flex items-center justify-between'>
                          <div className='text-xs capitalize text-gray-500'>
                            {purchasesInCart.length > MAX_PURCHASES ? purchasesInCart.length - MAX_PURCHASES : ''}{' '}
                            Products In Cart
                          </div>
                          <Link
                            to={path.cart}
                            // Tombol keranjang (primary = Oranye)
                            className='rounded-sm bg-primary px-4 py-2 capitalize text-white hover:bg-opacity-90'
                          >
                            View My Shopping Cart
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                        <img src={noproduct} alt='no purchase' className='h-24 w-24' />
                        <div className='mt-3 capitalize'>No Products Yet</div>
                      </div>
                    )}
                  </div>
                }
              >
                <Link to={path.cart} className='relative'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-8 w-8'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      // === 3. PERBAIKAN ERROR ADA DI SINI ===
                      // Saya menambahkan tanda kutip (') yang hilang di akhir string ini
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                    />
                  </svg>
                  {purchasesInCart && purchasesInCart.length > 0 && (
                    // Badge hitungan (primary = Oranye)
                    <span className='absolute top-[-5px] left-[17px] rounded-full bg-white px-[9px] py-[1px] text-xs text-primary '>
                      {purchasesInCart?.length}
                    </span>
                  )}
                </Link>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}