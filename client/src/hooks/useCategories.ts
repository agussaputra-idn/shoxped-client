// Awal file (imports)
import { useQuery } from '@tanstack/react-query';
import { CATEGORIES_QUERY_KEY } from '../constants/queryKey';
import { Category } from '../types/category.type';
import { SuccessResponseApi } from '../types/util.type';

// Tipe
type CategoriesResponse = {
  isLoading: boolean;
  error: unknown;
  isError: boolean;
  data?: SuccessResponseApi<Category[]>;
};

// --- FUNGSI BARU YANG DIPERBAIKI ---
// Fungsi ini sekarang mengembalikan Promise yang 'resolve'
// Ini akan memberi tahu React Query bahwa 'loading' sudah selesai.
const fetchCategories = (): Promise<SuccessResponseApi<Category[]>> => {
  console.log("fetchCategories (dinonaktifkan) dipanggil, mengembalikan data kosong.");
  return Promise.resolve({
    data: [], // Mengembalikan data dengan struktur yang diharapkan
    message: "Categories stubbed"
  });
};

// Hook 'useCategories'
export const useCategories = (): CategoriesResponse => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: fetchCategories, // Panggil fungsi yang sudah benar
    staleTime: 3 * 60 * 1000,
    onSuccess: (response) => {
      console.log('Data Kategori (Kosong):', response);
    },
    onError: (err) => {
      console.log('Error (useCategories): ', err);
    }
  });
  return { data, error, isError, isLoading };
};