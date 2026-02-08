export interface Product {
  _id: string;
  id?: string; // Tambahan: Kompatibilitas untuk ID Firebase
  
  name: string;
  price: number;
  image: string; // Image utama
  images: string[]; // Gallery images
  
  description: string;
  
  // Update: Category bisa berupa Object (lama) atau String (baru/firebase)
  category: {
    _id: string;
    name: string;
  } | string;

  // Update: Sold bisa number (lama) atau string seperti '10RB+' (baru)
  sold: number | string;
  
  rating: number;
  price_before_discount: number;
  quantity: number;
  view: number;
  
  createdAt: string;
  updatedAt: string;

  // --- FIELD BARU (WAJIB ADA UNTUK FITUR TIKTOK) ---
  link?: string;                  // Link Affiliate (PENTING!)
  platform?: 'shopee' | 'tiktok'; // Penanda sumber data
  tiktok_id?: string;             // ID Unik produk TikTok
}

export interface ProductList {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
}

export enum SortType {
  createdAt = 'createdAt',
  view = 'view',
  sold = 'sold',
  price = 'price'
}

export enum OrderType {
  asc = 'asc',
  desc = 'desc'
}

export interface ProductListConfig {
  page?: number | string;
  limit?: number | string;
  sort_by?: SortType;
  order?: OrderType;
  exclude?: string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
  category?: string;
}