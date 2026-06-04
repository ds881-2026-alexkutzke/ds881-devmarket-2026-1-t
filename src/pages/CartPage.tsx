import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useExchangeRate } from '../hooks/useExchangeRate';
import CartItemRow from '../components/CartItemRow';
import CartSummary from '../components/CartSummary';
import './styles/CartPage.css';

export default function CartPage() {
  const { state: { items }, clearCart } = useCart();
  const { rate, loading: rateLoading } = useExchangeRate();
  const navigate = useNavigate();

  const effectiveRate = rate ?? null;

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <h1 className="cart-page__title">Carrinho</h1>
        <div className="cart-page__empty">
          <p className="cart-page__empty-text">Seu carrinho de compras está vazio.</p>
          <button
            type="button"
            className="cart-page__browse-btn"
            onClick={() => navigate('/')}
          >
            Conferir produtos
          </button>
        </div>
      </main>
    );
  }

return (
    <main className="cart-page">
      <h1 className="cart-page__title">Carrinho</h1>

      <div className="cart-page__body">
        <section className="cart-page__items" aria-label="Itens do carrinho">
          {rateLoading ? (
            <p className="cart-page__loading">Carregando preços...</p>
          ) : (
            <>
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  rate={effectiveRate ?? 1}
                />
              ))}

              <div className="cart-page__actions">
                <button
                  type="button"
                  className="cart-page__clear-btn"
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="cart-page__sidebar">
          <CartSummary items={items} rate={effectiveRate} />
          <button
            type="button"
            className="cart-page__checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Finalizar Compra
          </button>
        </aside>
      </div>
    </main>
  );
}