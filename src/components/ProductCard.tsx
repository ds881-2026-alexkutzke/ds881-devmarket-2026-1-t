import { Link } from 'react-router-dom';
import type { Product } from '../types/product.types';
import './styles/ProductCard.css';
import { useCart } from "../hooks/useCart";

type ProductCardProps = {
  product: Product;
 feat/productcard-navegacao-170
  conversionRate?: number | null; 

  conversionRate?: number | null;
 main
};

export default function ProductCard({
  product,
  conversionRate,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (!product) {
    return (
      <div className="product-card-error">
        Erro: Produto não fornecido.
      </div>
    );
  }

  const isBRL = conversionRate != null && conversionRate > 0;
 feat/productcard-navegacao-170
  const finalPrice = isBRL ? (product.price || 0) * conversionRate : (product.price || 0);
  const formattedPrice = new Intl.NumberFormat(isBRL ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: isBRL ? 'BRL' : 'USD',
  }).format(finalPrice);

  return (
    <Link to={`/produto/${product.id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-card-image-wrapper">
          <img 
            src={product.thumbnail || 'https://via.placeholder.com/150'} 
            alt={`Imagem de ${product.title || 'Produto'}`} 
            className="product-card-thumbnail" 
            loading="lazy" 
          />
        </div>
        <div className="product-card-content">
          <h3 className="product-card-title" title={product.title || ''}>
            {product.title || 'Produto sem título'}
          </h3>


  const finalPrice = isBRL
    ? (product.price || 0) * conversionRate
    : (product.price || 0);

  const formattedPrice = new Intl.NumberFormat(
    isBRL ? 'pt-BR' : 'en-US',
    {
      style: 'currency',
      currency: isBRL ? 'BRL' : 'USD',
    }
  ).format(finalPrice);

  return (
    <article className="product-card">
      <Link to={`produto/${product.id}`}>
        <div className="product-card-image-wrapper">
          <img
            src={product.thumbnail || 'https://via.placeholder.com/150'}
            alt={`Imagem de ${product.title || 'Produto'}`}
            className="product-card-thumbnail"
            loading="lazy"
          />
        </div>

        <div className="product-card-content">
          <h3
            className="product-card-title"
            title={product.title || ''}
          >
            {product.title || 'Produto sem título'}
          </h3>

 main
          <p className="product-card-price">
            {formattedPrice}
          </p>
        </div>
 feat/productcard-navegacao-170
      </article>
    </Link>

      </Link>

      <button type="button" onClick={handleAddToCart}>
        Adicionar ao carrinho
      </button>
    </article>
 main
  );
}