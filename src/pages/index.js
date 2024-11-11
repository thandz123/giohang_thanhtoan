  import { useEffect, useState } from "react";
  import { useRouter } from "next/router";
  import { useCheckout } from "../../contexts/CheckoutContext";

  export default function Home() {
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [quantities, setQuantities] = useState({});
    const router = useRouter();
    const { setCheckoutData } = useCheckout();


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/hello");
          const result = await response.json();
          console.log("Data fetched from API:", result);
          setData(result.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);

    // Xử lý chọn từng sản phẩm
    const handleSelectItem = (item) => {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.find((selected) => selected._id === item._id)) {
          return prevSelectedItems.filter((selected) => selected._id !== item._id);
        } else {
          return [...prevSelectedItems, item];
        }
      });
    };

    // Xử lý chọn tất cả sản phẩm
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems([]);
      } else {
        setSelectedItems(data);
      }
      setSelectAll(!selectAll);
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (itemId, quantity) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: quantity,
      }));
    };

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (itemId) => {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item._id !== itemId)
      );
      setData((prevData) => prevData.filter((item) => item._id !== itemId));
    };

    //Xử lý thanh toán
    

const handleCheckout = () => {
  if (selectedItems.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
  } else {
    const selectedItemsWithQuantities = selectedItems.map((item) => ({
      ...item,
      quantity: quantities[item._id] || 1,
    }));
    // Lưu dữ liệu vào context
    setCheckoutData(selectedItemsWithQuantities);
    // Điều hướng đến trang thanh toán
    router.push("/thanhtoan");
  }
};



    return (
      <div className="cart-container">
        <h1>Giỏ Hàng ({selectedItems.length} sản phẩm)</h1>
        <div className="cart-content">
          <div className="cart-items">
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              Chọn tất cả ({data.length} sản phẩm)
            </label>
            {data.map((item) => (
              <div key={item._id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.some((selected) => selected._id === item._id)}
                  onChange={() => handleSelectItem(item)}
                  className="item-checkbox"
                />
                <img src={item.image_url} alt={item.title} className="item-image" />
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-price">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                  {selectedItems.some((selected) => selected._id === item._id) && (
                    <div className="item-quantity">
                      <button
                        onClick={() => handleQuantityChange(item._id, (quantities[item._id] || 1) - 1)}
                        disabled={(quantities[item._id] || 1) <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantities[item._id] || 1}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, (quantities[item._id] || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <p className="item-total">
                    Tổng: {(item.price * (quantities[item._id] || 1)).toLocaleString("vi-VN")} đ
                  </p>
                  {/* Nút xóa sản phẩm */}
                  <button onClick={() => handleRemoveItem(item._id)} className="remove-button">
                    Xóa
                  </button>

                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Thành tiền</h3>
            <p className="total-amount">
              {selectedItems
                .reduce((sum, item) => sum + item.price * (quantities[item._id] || 1), 0)
                .toLocaleString("vi-VN")} đ
            </p>
            <button onClick={handleCheckout} className="checkout-button">
              Thanh toán
            </button>
          </div>
        </div>
        <style jsx>{`
    .cart-container {
      max-width: 1400px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f9fafb;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    h1 {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 24px;
      
    }

    .cart-content {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .cart-items {
      flex: 0.7;
      background: #fff;
      padding: 20px;
      flex-grow: 1;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .select-all {
      font-weight: bold;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-checkbox {
      margin-right: 15px;
      transform: scale(1.2);
    }

    .item-image {
      width: 100px;
      height: 120px;
      object-fit: cover;
      margin-right: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .item-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .item-price {
      color: #ef4444;
      font-weight: bold;
      font-size: 16px;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .item-quantity input {
      width: 60px;
      padding: 4px;
      font-size: 16px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .item-quantity button {
      background: #f1f5f9;
      border: 1px solid #ddd;
      padding: 5px 10px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }

    .item-quantity button:hover {
      background-color: #e5e7eb;
    }

    .item-total {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }

    .remove-button {
      background-color: #ff4d4f;
      color: #fff;
      padding: 3px 8px;  /* Giảm kích thước padding */
      font-size: 12px;  /* Giảm kích thước font chữ */
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      position: absolute;  /* Đặt button ở vị trí tuyệt đối */
      right: 10px;  /* Căn lề phải */
      top: 50%;  /* Đưa button vào giữa theo chiều dọc */
      transform: translateY(-50%);  /* Căn giữa chính xác */
  }
  .cart-item {
      display: flex;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
      position: relative;  /* Để button xóa có thể căn được */
  }

  .remove-button:hover {
      background-color: #d8343d;
  }

    .remove-button:hover {
      background-color: #d8343d;
    }

    .cart-summary {
      flex: 0.25;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cart-summary h3 {
      font-size: 22px;
      margin-bottom: 20px;
      font-weight: bold;
      color: #333;
    }

    .total-amount {
      font-size: 26px;
      color: #ef4444;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .checkout-button {
      background-color: #ef4444;
      color: #fff;
      padding: 15px;
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .checkout-button:hover {
      background-color: #d8343d;
    }
  `}</style>

      </div>
    );
  }
