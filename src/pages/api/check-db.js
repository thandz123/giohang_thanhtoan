import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Kết nối tới MongoDB
    const client = await clientPromise;
    const db = client.db(); // Sử dụng database mặc định từ URI hoặc tự chỉ định

    // Kiểm tra danh sách collection
    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: 'Kết nối thành công!',
      collections,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kết nối thất bại!',
      error: error.message,
    });
  }
}
