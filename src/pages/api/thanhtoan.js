import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Đọc URI MongoDB từ biến môi trường


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fullName, email, phone, province, district, ward, address, paymentMethod, items, total } = req.body;

    if (!fullName || !email || !phone || !province || !district || !ward || !address || !paymentMethod || !items) {
      return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    try {
      // Kết nối đến MongoDB
      const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db("Thanhtoan");

      // Lưu thông tin thanh toán
      
      const result = await db.collection("thanhtoan").insertOne({
        fullName,
        email,
        phone,
        address: {
          province,
          district,
          ward,
          address,
        },
        paymentMethod,
        items,
        total,
        createdAt: new Date(),
      });

      // Đóng kết nối
      client.close();

      // Phản hồi thành công
      res.status(201).json({ message: "Đơn hàng đã được lưu.", orderId: result.insertedId });
    } catch (error) {
      console.error("Lỗi khi lưu vào MongoDB:", error);
      res.status(500).json({ message: "Lỗi máy chủ. Không thể lưu đơn hàng." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Phương thức ${req.method} không được hỗ trợ.` });
  }
}
