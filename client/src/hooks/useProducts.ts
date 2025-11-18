import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEY, PRODUCT_QUERY_KEY } from '../constants/queryKey';
import { SuccessResponseApi } from '../types/util.type';
import dummyData from '../dummyData.json'; // Pastikan ini di-import

// Tipe data
type ProductPair = typeof dummyData.productRows[0]['pairs'][0];
type ProductRow = {
  rowCategory: string;
  pairs: ProductPair[];
};

type ProductsResponse = {
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  data?: SuccessResponseApi<{ productRows: ProductRow[] }>;
};

// Fungsi Fetch Dummy (Langsung mengembalikan data)
const fetchProducts = async (): Promise<SuccessResponseApi<{ productRows: ProductRow[] }>> => {
  // Simulasi delay sedikit agar terasa nyata (opsional)
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  return {
    message: "Success (Dummy)",
    data: {
      productRows: dummyData.productRows, 
    }
  };
};

export const useProducts = (queryParams: any): ProductsResponse => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, queryParams],
    queryFn: fetchProducts,
    
    // === PENTING: SET KE TRUE AGAR DUMMY MUNCUL ===
    enabled: true, 
    // ==============================================

    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
  });
  
  return { data, error, isError, isLoading };
};

// Logika produk tunggal (biarkan mati)
const fetchProduct = async (productId: string) => { return null; };
export const useProduct = (productId: string) => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [PRODUCT_QUERY_KEY, productId],
    queryFn: () => fetchProduct(productId),
    enabled: false
  });
  return { data, error, isError, isLoading };
};