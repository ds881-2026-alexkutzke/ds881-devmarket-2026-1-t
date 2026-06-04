import { useCart } from "../hooks/useCart";
import CartItemRow from '../components/CartItemRow';

export default function CartPage() {
  const { items } = useCart();
  const rate = 5.7; // taxa fixa para testes

  return (
    <main>
      <h1>Carrinho</h1>
      {items.map((item) => (
        <CartItemRow key={item.product.id} item={item} rate={rate} />
      ))}
    </main>
  );
}