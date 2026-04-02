import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}