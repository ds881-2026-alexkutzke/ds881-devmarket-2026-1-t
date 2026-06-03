import type { CartItem } from '../types/cart.types';
import { formatBRL } from '../utils/formatCurrency';
import './styles/CartSummary.css';

type CartSummaryProps = {
  items: CartItem[];
  rate: number | null;
};

export default function CartSummary({ items, rate }: CartSummaryProps) {
  const totalUsd = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const renderTotal = () => {
    if (rate !== null) {
      return formatBRL(totalUsd, rate);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(totalUsd);
  };

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Resumo do Pedido</h2>
      <div className="cart-summary__row">
        <span className="cart-summary__label">Total</span>
        <span className="cart-summary__value">{renderTotal()}</span>
      </div>
    </div>
  );
}