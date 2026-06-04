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
  const { dispatch } = useCart();

  const { product, quantity } = item;

  function handleIncrease() {
    dispatch({
        type: 'ADD_ITEM',
        payload: { product },
    });
  }

  function handleDecrease() {
    dispatch({ type: 'DECREMENT_ITEM', payload: { id: product.id } });
  }

  function handleRemove() {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: product.id } });
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
