import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 1. KAMUS KATA (Tinggal tambah disini jika ada kata baru)
const translations = {
  id: {
    placeholder: "Cari produk, merek, dan toko...",
    shopee: "Beli di Shopee",
    tiktok: "Beli di TikTok",
    search_result: "Hasil pencarian:",
    not_found: "Produk tidak ditemukan",
    trending: "Lagi Trending",
    categories: {
      all: "Semua",
      fashion: "Fashion",
      shoes: "Sepatu",
      bag: "Tas",
      electronic: "Elektronik",
      beauty: "Kecantikan",
      others: "Lainnya"
    }
  },
  en: {
    placeholder: "Search products, brands, and shops...",
    shopee: "Buy on Shopee",
    tiktok: "Buy on TikTok",
    search_result: "Search results:",
    not_found: "Product not found",
    trending: "Trending Now",
    categories: {
      all: "All",
      fashion: "Fashion",
      shoes: "Shoes",
      bag: "Bags",
      electronic: "Electronics",
      beauty: "Beauty",
      others: "Others"
    }
  }
};

type Language = 'id' | 'en';
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.id; // Type untuk akses kata-kata
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Cek localStorage dulu, kalau tidak ada default ke 'id'
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('appLanguage') as Language) || 'id';
  });

  // Simpan ke localStorage setiap kali bahasa berubah
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};