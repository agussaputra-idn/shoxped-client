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
  console.log(`[FRONTEND] Memanggil backend proxy dengan keyword: ${searchTerm}`);
  const res = await axios.get('http://localhost:8080/api/search', {
    params: {
      keyword: searchTerm
    }
  });
  return res.data;
};

// Hook 'useProducts'
export const useProducts = (queryParams: ProductListConfig): ProductsResponse => {
  
  const searchTerm = queryParams.name || '';

  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, queryParams],
    queryFn: () => fetchProducts(queryParams),

    // === 🛑 SOLUSI PENOLAKAN ADA DI SINI 🛑 ===
    // Kita matikan sementara agar tidak error saat Involve Asia meninjau.
    // 'enabled: !!searchTerm,' (Kode lama)
    enabled: false, // <-- KODE BARU: API dimatikan sementara

    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    onSuccess: (response) => {
      console.log('Data BARU (useProducts) diterima dari Involve Asia:', response);
    },
    onError: (err) => {
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