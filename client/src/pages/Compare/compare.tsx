import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { PRODUCTS_DATA } from 'src/data/products';

export default function Compare() {
  const { slug } = useParams();

  const product = PRODUCTS_DATA.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-xl font-bold mb-3">Produk tidak ditemukan</h1>
        <Link to="/" className="text-orange-500 font-semibold">
          ← Kembali ke Home
        </Link>
      </div>
    );
  }

  const cheaper =
    product.shopeePrice < product.tiktokPrice ? 'Shopee' : 'TikTok Shop';

  const diff = Math.abs(product.shopeePrice - product.tiktokPrice);

  useEffect(() => {
    document.title = `Perbandingan Harga ${product.title} | ShoXped`;
  }, [product.title]);

  const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(n);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Perbandingan Harga {product.title}
      </h1>

      <p className="mb-6 text-gray-600">
        Harga termurah tersedia di <b>{cheaper}</b><br />
        Selisih harga <b>{rupiah(diff)}</b>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-2">Shopee</h2>
          <p>Harga: {rupiah(product.shopeePrice)}</p>
          <p>Rating: ⭐ {product.shopeeRating}</p>
          <a href={product.shopeeLink} target="_blank"
            className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded">
            Beli di Shopee
          </a>
        </div>

        <div className="border rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-2">TikTok Shop</h2>
          <p>Harga: {rupiah(product.tiktokPrice)}</p>
          <p>Rating: ⭐ {product.tiktokRating}</p>
          <a href={product.tiktokLink} target="_blank"
            className="inline-block mt-4 bg-black text-white px-4 py-2 rounded">
            Beli di TikTok Shop
          </a>
        </div>
      </div>
    </div>
  );
}
