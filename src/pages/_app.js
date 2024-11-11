import { CheckoutProvider } from "../../contexts/CheckoutContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <CheckoutProvider>
      <Component {...pageProps} />
    </CheckoutProvider>
  );
}
