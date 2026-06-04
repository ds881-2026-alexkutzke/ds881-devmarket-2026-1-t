import { useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { generatePixPayload } from "../utils/pixGenerator";
import CartSummary from "../components/CartSummary";
import OrderSummary from "../components/OrderSummary";
import PixQRCode from "../components/PixQRCode";
import "./styles/PaymentPage.css";

export default function PaymentPage() {
  const { state } = useCart();
  const { rate, loading, error } = useExchangeRate();

  const totalUsd = useMemo(
    () =>
      state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [state.items],
  );

  const pixPayload = generatePixPayload(totalUsd);

  return (
    <div className="payment-page">
      <h1 className="payment-page__header">Pagamento</h1>
      <div className="payment-page__content">
        {error && (
          <div role="alert" className="payment-page__empty">
            Não foi possível carregar a taxa de câmbio: {error}
          </div>
        )}
        <div className="payment-page__grid">
          <div>
            {rate !== null ? (
              <OrderSummary items={state.items} rate={rate} />
            ) : (
              <p>Carregando resumo do pedido...</p>
            )}
            <CartSummary items={state.items} rate={rate} />
          </div>
          <div className="pix-payment">
            <h2 className="pix-payment__title">Pagamento por PIX</h2>
            <PixQRCode payload={pixPayload} />
            <p className="pix-payment__note">
              Valor total em USD convertido para PIX com base na taxa atual.
            </p>
            {loading && <p>Carregando taxa de câmbio...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
