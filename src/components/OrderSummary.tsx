import type { CartItem } from '../types/cart.types';
import { formatBRL } from '../utils/formatCurrency';
import './styles/OrderSummary.css';

type OrderSummaryProps = {
  items: CartItem[];
  rate: number;
};

export default function OrderSummary({ items, rate }: OrderSummaryProps) {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <section className="order-summary" aria-label="Resumo do pedido">
      <h2 className="order-summary__title">Resumo do Pedido</h2>

      <ul className="order-summary__list">
        {items.map((item) => (
          <li key={item.product.id} className="order-summary__item">
            <div className="order-summary__item-info">
              <span className="order-summary__item-name">{item.product.title}</span>
              <span className="order-summary__item-qty">
                {item.quantity}x {formatBRL(item.product.price, rate)}
              </span>
            </div>
            <span className="order-summary__item-subtotal">
              {formatBRL(item.product.price * item.quantity, rate)}
            </span>
          </li>
        ))}
      </ul>

      <div className="order-summary__total">
        <span>Total</span>
        <span>{formatBRL(total, rate)}</span>
      </div>
    </section>
  );
}
