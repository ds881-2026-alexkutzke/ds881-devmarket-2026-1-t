import type { CartItem } from "../types/cart.types";
import { useMemo } from "react";

export default function OrderSummary({
  items,
  rate,
}: {
  items: CartItem[];
  rate: number | null;
}) {
  const totalUsd = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
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
