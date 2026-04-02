import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // Buat client di dalam handler agar koneksi lebih bersih untuk serverless
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('shoxped_db');
    const products = database.collection('products');

    if (req.method === 'GET') {
      // Ambil semua produk dari MongoDB
      const allProducts = await products.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(allProducts);
    } 

    if (req.method === 'POST') {
      // Simpan produk baru ke MongoDB
      const newProduct = req.body;
      const result = await products.insertOne({
        ...newProduct,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json(result);
    }
    
    // Jika ada method lain (misal PUT/DELETE) yang belum diatur
    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  } finally {
    // 🔥 SANGAT PENTING: Tutup koneksi setelah selesai
    await client.close();
  }
}