import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEY, PRODUCT_QUERY_KEY } from '../constants/queryKey';
// import { ProductList, ProductListConfig } from '../types/product.type'; // <-- Ini tidak lagi kita pakai
import { SuccessResponseApi } from '../types/util.type';

// --- IMPORT DATA DUMMY KITA ---
import dummyData from '../dummyData.json';

// Definisikan tipe data untuk satu "pasangan produk"
type ProductPair = typeof dummyData.productRows[0]['pairs'][0];

// Definisikan tipe data untuk satu "baris produk"
type ProductRow = {
  rowCategory: string;
  pairs: ProductPair[];
};

type ProductsResponse = {
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  // Kita ubah tipe data yang dikembalikan menjadi array of ProductRow
  data?: SuccessResponseApi<{ productRows: ProductRow[] }>;
};

// --- FUNGSI 'fetchProducts' SEKARANG MENGEMBALIKAN DATA DUMMY BARU ---
const fetchProducts = async (): Promise<SuccessResponseApi<{ productRows: ProductRow[] }>> => {
  console.log('[DUMMY] Mengembalikan data produk palsu (berbaris).');
  
  // Kita 'mensimulasikan' struktur data yang diharapkan oleh UI
  return {
    message: "Success (Dummy)",
    data: {
      // Kuncinya sekarang 'productRows'
      productRows: dummyData.productRows, 
    }
  };
};

// --- 'useProducts' SEKARANG MENGGUNAKAN 'fetchProducts' DUMMY ---
export const useProducts = (queryParams: any): ProductsResponse => { // queryParams di-set any untuk sementara
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, queryParams],
    queryFn: fetchProducts,
    enabled: true,
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    onSuccess: (response) => {
      console.log('Data DUMMY (Berbaris) berhasil dimuat:', response);
    },
    onError: (err) => {
      console.log('Error (useProducts): ', err);
    }
  });
  
  return { data, error, isError, isLoading };
};

// --- LOGIKA PRODUK TUNGGAL (TIDAK BERUBAH) ---
const fetchProduct = async (productId: string) => {
  return null;
};
export const useProduct = (productId: string) => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCT_QUERY_KEY, productId],
    queryFn: () => fetchProduct(productId),
    enabled: false
  });
  return { data, error, isError, isLoading };
};