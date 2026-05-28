import type { CartItem } from '../types/cart.types';
import { formatBRL } from '../utils/formatCurrency';
import './styles/CartSummary.css';

type CartSummaryProps = {
  items: CartItem[];
  rate: number;
};

const CartSummary = ({ items, rate }: CartSummaryProps) => {
  const totalUsd = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Resumo do Pedido</h2>
      <div className="cart-summary__row">
        <span className="cart-summary__label">Total</span>
        <span className="cart-summary__value">{formatBRL(totalUsd, rate)}</span>
      </div>
    </div>
  );
};

export default CartSummary;