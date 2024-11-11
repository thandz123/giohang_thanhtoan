import { createContext, useContext, useState } from "react";

// Tạo context
const CheckoutContext = createContext();

// Tạo provider
export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState([]);

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Sử dụng context
export const useCheckout = () => useContext(CheckoutContext);
