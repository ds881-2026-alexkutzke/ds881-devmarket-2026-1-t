import { useCart } from '../store/cartStore';
import CartItemRow from '../components/CartItemRow';

export default function CartPage() {
  const { state } = useCart();
  const rate = 5.7; // taxa fixa para testes

  return (
    <main>
      <h1>Carrinho</h1>
      {state.items.map((item) => (
        <CartItemRow key={item.product.id} item={item} rate={rate} />
      ))}
    </main>
  );
}