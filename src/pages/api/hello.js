import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Truy vấn dữ liệu từ collection
    const collection = db.collection("book"); // Thay bằng tên collection của bạn
    const data = await collection.find({}).toArray();

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
