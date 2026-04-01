export default async function handler(req, res) {
  // Cek token agar aman
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Token Salah' });
  }

  try {
    // Perintah update halaman utama shoxped.com
    await res.revalidate('/');
    return res.json({ revalidated: true, message: 'Web Berhasil Diupdate!' });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}