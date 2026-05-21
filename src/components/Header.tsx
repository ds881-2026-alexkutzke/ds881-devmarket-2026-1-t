import { FiShoppingCart } from "react-icons/fi";
import "./styles/Header.css";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__logo">DevMarket</span>

      <nav className="header__nav">
        {/* Adicione aqui a rota da pagina Home - por enquanto nao vai pra lugar nenhum */}
        <a href="/" className="header__link">Home</a>

        {/* Adicione aqui a rota da pagina Sobre */}
        <a href="/sobre" className="header__link">Sobre</a>
      </nav>

      {/* Adicione aqui a rota da pagina Carrinho */}
      <div className="header__cart">
        <FiShoppingCart className="header__cart-icon" />
        {cartCount > 0 && (
          <span className="header__badge">{cartCount}</span>
        )}
      </div>
    </header>
  );
}