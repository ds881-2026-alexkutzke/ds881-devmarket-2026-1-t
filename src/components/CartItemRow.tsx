import type { CartItem } from '../types/cart.types';
import { formatBRL } from '../utils/formatCurrency';
import { useCart } from '../store/cartStore';
import './styles/CartItemRow.css';
import { Link } from 'react-router-dom';

type CartItemRowProps = {
  item: CartItem;
  rate: number;
};

export default function CartItemRow({ item, rate }: CartItemRowProps) {
  const { addToCart, decrementItem, removeFromCart } = useCart();

  const { product, quantity } = item;

  function handleIncrease() {
    addToCart(product);
  }

  function handleDecrease() {
    decrementItem(product.id);
  }

  function handleRemove() {
    removeFromCart(product.id);
  }

  const unitPrice = formatBRL(product.price, rate);
  const totalPrice = formatBRL(product.price * quantity, rate);

  return (
    <div className="cart-item-row">
      <Link to={`/produto/${product.id}`} className="cart-item-row__link">
        <img
          className="cart-item-row__image"
          src={product.thumbnail}
          alt={`Imagem de ${product.title}`}
          loading="lazy"
        />
      </Link>

      <div className="cart-item-row__info">
        <Link to={`/produto/${product.id}`} className="cart-item-row__link">
          <p className="cart-item-row__title">{product.title}</p>
        </Link>
        <p className="cart-item-row__unit-price">{unitPrice} / un.</p>

        <div className="cart-item-row__quantity">
          <button
            type="button"
            className="cart-item-row__qty-btn"
            onClick={handleDecrease}
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="cart-item-row__qty-value">{quantity}</span>
          <button
            type="button"
            className="cart-item-row__qty-btn"
            onClick={handleIncrease}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>

      <p className="cart-item-row__total-price">{totalPrice}</p>

      <button
        type="button"
        className="cart-item-row__remove-btn"
        onClick={handleRemove}
        aria-label={`Remover ${product.title} do carrinho`}
      >
        ✕
      </button>
    </div>
  );
}