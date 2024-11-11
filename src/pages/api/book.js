import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('myDatabase');
    const books = await db.collection('book').find({}).toArray();

    res.status(200).json(books); // Trả về JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu sách:', error);
    res.status(500).json({ message: 'Không thể lấy dữ liệu sách' });
  }
}
