import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./styles/Header.css";
import { useCart } from "../hooks/useCart";

export default function Header() {
  const { state: { items } } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <span className="header__logo">DevMarket</span>

      <div className="header__right">
        <nav className="header__nav">
          <Link to="/" className="header__link">
            Home
          </Link>

          {/* Adicione aqui a rota da pagina Sobre */}
          <Link to="/sobre" className="header__link">
            Sobre
          </Link>
        </nav>

        {/* Rota da página Carrinho */}
        <Link to="/carrinho" className="header__cart">
          <span className="header__cart-icon">
            <FiShoppingCart />
          </span>

          {cartCount > 0 && (
            <span className="header__badge">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
