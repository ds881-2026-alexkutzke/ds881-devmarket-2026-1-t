import type { CartItem } from "../types/cart.types";
import { useMemo } from "react";
import { useCart } from "../store/cartStore";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { generatePixPayload } from "../utils/pixGenerator";
import CartSummary from "../components/CartSummary";
import PixQRCode from "../components/PixQRCode";
import "./styles/PaymentPage.css";

function OrderSummary({ items, rate }: { items: CartItem[]; rate: number | null }) {
  const totalUsd = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items],
  );

  return (
    <div className="order-summary">
      <h2 className="order-summary__title">Resumo do Pedido</h2>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.product.id} className="order-summary__item">
              <div>
                <div className="order-summary__item-name">{item.product.title}</div>
                <div className="order-summary__label">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </div>
              </div>
              <div className="order-summary__value">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="order-summary__totals">
            <div className="order-summary__row">
              <span className="order-summary__label">Total em USD</span>
              <span className="order-summary__value">${totalUsd.toFixed(2)}</span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Taxa de câmbio</span>
              <span className="order-summary__value">
                {rate !== null ? rate.toFixed(4) : "Carregando..."}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

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
            <OrderSummary items={state.items} rate={rate} />
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
