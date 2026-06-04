import { FiShoppingCart } from "react-icons/fi";
import "./styles/Header.css";
import { useCart } from "../hooks/useCart";

export default function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <span className="header__logo">DevMarket</span>

      <div className="header__right">
        <nav className="header__nav">
          {/* Adicione aqui a rota da pagina Home - por enquanto nao vai pra lugar nenhum */}
          <a href="/" className="header__link">Home</a>

          {/* Adicione aqui a rota da pagina Sobre */}
          <a href="/sobre" className="header__link">Sobre</a>
        </nav>

        {/* Adicione aqui a rota da pagina Carrinho */}
        <div className="header__cart">
          <span className="header__cart-icon"><FiShoppingCart /></span>
          {cartCount > 0 && (
            <span className="header__badge">{cartCount}</span>
          )}
        </div>
      </div>
    </header>
  );
}