import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./styles/Header.css";
import { useCart } from "../store/cartStore";

export default function Header() {
  const { state } = useCart();
  const cartCount = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return (
    <header className="header">
      <span className="header__logo">DevMarket</span>

      <div className="header__right">
        <nav className="header__nav">
          <a href="/" className="header__link">
            Home
          </a>

          <a href="/sobre" className="header__link">
            Sobre
          </a>
        </nav>

        <Link to="/cart" className="header__cart">
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