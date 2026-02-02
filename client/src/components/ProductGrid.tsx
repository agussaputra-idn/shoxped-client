"use client"; // Ini wajib karena ada interaksi user (klik/gambar)

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  shopeeUrl: string;
}

export default function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  
  // Format Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {initialProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
          
          {/* --- BAGIAN GAMBAR (DIPERBAIKI) --- */}
          <div className="relative w-full h-48 bg-gray-200">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                className="object-cover"
                loading="lazy"
                // 🛡️ JIMAT ANTI BLOKIR SHOPEE:
                referrerPolicy="no-referrer" 
                unoptimized={true} 
                onError={(e) => {
                    // Kalau gambar error, ganti placeholder
                    e.currentTarget.srcset = "https://placehold.co/400?text=No+Image"; 
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* --- BAGIAN TEKS --- */}
          <div className="p-3 flex flex-col flex-grow">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1" title={product.name}>
              {product.name}
            </h3>
            <p className="text-orange-600 font-bold text-lg mt-auto">
              {formatRupiah(product.price)}
            </p>
            
            {/* Tombol Beli */}
            <Link 
              href={product.shopeeUrl} 
              target="_blank"
              className="mt-3 w-full bg-orange-500 text-white text-center py-2 rounded text-sm font-semibold hover:bg-orange-600 transition"
            >
              Beli Sekarang
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}