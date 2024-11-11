import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCheckout } from "../../contexts/CheckoutContext";

export default function ThanhToan() {
  const router = useRouter();
  const { checkoutData } = useCheckout();

  // Nếu không có dữ liệu, điều hướng trở lại giỏ hàng
  useEffect(() => {
    if (!checkoutData || checkoutData.length === 0) {
      router.push("/");
    }
  }, [checkoutData, router]);

  // Khai báo các trạng thái
  const [data, setData] = useState({}); // Thêm khai báo data
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [wards, setWards] = useState([]); // Danh sách phường/xã
  const [selectedProvince, setSelectedProvince] = useState(""); // Tỉnh/Thành phố
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Quận/Huyện
  const [selectedWard, setSelectedWard] = useState(""); // Phường/Xã
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const selectedItems = checkoutData || [];
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Lấy dữ liệu từ file JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData); // Cập nhật data
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Cập nhật quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    if (selectedProvince && data[selectedProvince]) {
      setDistricts(Object.keys(data[selectedProvince]));
      setSelectedDistrict("");
      setWards([]);
    }
  }, [selectedProvince, data]);

  // Cập nhật phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    if (selectedDistrict && data[selectedProvince]?.[selectedDistrict]) {
      setWards(data[selectedProvince][selectedDistrict]);
    }
  }, [selectedDistrict, data, selectedProvince]);

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    const orderData = {
      fullName: document.querySelector(".full-name-input").value,
      email: document.querySelector(".email-input").value,
      phone: document.querySelector(".phone-input").value,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      address: document.querySelector(".address-input").value,
      paymentMethod: selectedPayment,
      items: selectedItems,
      total: total,
    };

    try {
      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Thanh toán thành công! Mã đơn hàng: ${data.orderId}`);
        router.push("/"); // Quay lại trang chủ sau khi thanh toán thành công
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Không thể thanh toán, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Trang Thanh Toán</h1>

      {/* Địa chỉ giao hàng */}
      <div className="section shipping-address">
        <h2 className="section-title">Địa chỉ giao hàng</h2>
        <div className="form-group">
          <label className="form-label">Họ và tên người nhận</label>
          <input type="text" className="form-input full-name-input" placeholder="Nhập họ và tên người nhận" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input email-input" placeholder="Nhập email" />
        </div>
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input type="text" className="form-input phone-input" placeholder="Ví dụ: 0979123xxx (10 ký tự số)" />
        </div>
        <div className="form-group">
          <label className="form-label">Tỉnh/Thành Phố</label>
          <select
            className="form-select province-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {Object.keys(data).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Quận/Huyện</label>
          <select
            className="form-select district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Phường/Xã</label>
          <select
            className="form-select ward-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Địa chỉ nhận hàng</label>
          <input type="text" className="address-input" placeholder="Nhập địa chỉ nhận hàng" />
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="section">
        <h2>Phương thức thanh toán</h2>
        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="payment"
              value="vnpay"
              checked={selectedPayment === "vnpay"}
              onChange={() => setSelectedPayment("vnpay")}
            />
            VNPay
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={selectedPayment === "momo"}
              onChange={() => setSelectedPayment("momo")}
            />
            Ví Momo
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={selectedPayment === "cash"}
              onChange={() => setSelectedPayment("cash")}
            />
            Thanh toán bằng tiền mặt khi nhận hàng
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="atm"
              checked={selectedPayment === "atm"}
              onChange={() => setSelectedPayment("atm")}
            />
            ATM / Internet Banking
          </label>
        </div>
      </div>

      {/* Kiểm tra lại đơn hàng */}
      <div className="section">
        <h2>Kiểm tra lại đơn hàng</h2>
        <div className="order-items">
          {selectedItems.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.image_url} alt={item.title} className="item-image" />
              <div className="order-info">
                <p className="title">{item.title}</p>
                <p className="price">Giá: {item.price.toLocaleString("vi-VN")} đ</p>
                <p className="quantity">Số lượng: {item.quantity}</p>
                <p className="total">
                  Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>
          ))}
        </div>
        <h3 className="total-summary">Tổng giá trị đơn hàng: {total.toLocaleString("vi-VN")} đ</h3>
        <button onClick={handleCheckout} className="checkout-button">
          Hoàn tất thanh toán
        </button>
      </div>
      <style jsx>{`
        .checkout-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background-color: #f7f7f7;
        }

        .section {
          background-color: #fff;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }

        h2 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .payment-method label {
          display: block;
          padding: 10px 0;
          font-weight: bold;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .order-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #ddd;
        }

        .item-image {
          width: 80px;
          height: 100px;
          object-fit: cover;
          margin-right: 20px;
        }

        .order-info {
          display: flex;
          flex-direction: column;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
        }

        .price,
        .quantity,
        .total {
          color: #333;
        }

        .total-summary {
          font-size: 18px;
          color: #ff424e;
          font-weight: bold;
          margin-top: 20px;
          text-align: right;
        }

        .checkout-button {
          background-color: #ff424e;
          color: #fff;
          padding: 15px;
          width: 100%;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }

        .checkout-button:hover {
          background-color: #d8343d;
        }`
      }</style>
    </div>
  );
}
