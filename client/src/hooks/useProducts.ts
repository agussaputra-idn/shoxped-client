// Awal file (imports)
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { PRODUCTS_QUERY_KEY, PRODUCT_QUERY_KEY } from '../constants/queryKey';
import { Product, ProductList, ProductListConfig } from '../types/product.type';
import { SuccessResponseApi } from '../types/util.type';

// Tipe
type ProductsResponse = {
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  data?: SuccessResponseApi<ProductList>;
};

// --- LOGIKA BARU UNTUK MEMANGGIL BACKEND ANDA ---
const fetchProducts = async (queryParams: ProductListConfig): Promise<any> => {
  const searchTerm = queryParams.name || ''; 
  console.log(`[useProducts] Memanggil backend dengan keyword: ${searchTerm}`);

  const res = await axios.get('http://localhost:8080/api/search', {
    params: {
      keyword: searchTerm 
    }
  });
  return res.data;
};

// Hook 'useProducts'
export const useProducts = (queryParams: ProductListConfig): ProductsResponse => {
  
  // Ambil kata kunci pencarian
  const searchTerm = queryParams.name || '';

  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, queryParams],
    queryFn: () => fetchProducts(queryParams),

    // 🛑 SOLUSI ERROR 400 ADA DI SINI 🛑
    // 'enabled: true' hanya jika 'searchTerm' TIDAK KOSONG.
    // Ini mencegah React Query menelepon API saat kata kunci kosong.
    enabled: !!searchTerm, // (Tanda "!!" mengubah string menjadi boolean)

    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    onSuccess: (response) => {
      console.log('Data BARU (useProducts) diterima dari Involve Asia:', response);
    },
    onError: (err) => {
      // Kita sudah tahu ini akan error 400 jika 'enabled' tidak ada
      console.log('Error (useProducts) dari proxy: ', err);
    }
  });
  
  return { data, error, isError, isLoading };
};

// --- LOGIKA PRODUK TUNGGAL (TIDAK DIUBAH) ---
const fetchProduct = async (productId: string): Promise<SuccessResponseApi<Product>> => {
  const res = await axios.get(`/products/${productId}`);
  return res.data;
};

export const useProduct = (productId: string) => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCT_QUERY_KEY, productId],
    queryFn: () => fetchProduct(productId),
    staleTime: 3 * 60 * 1000
  });
  return { data, error, isError, isLoading };
};