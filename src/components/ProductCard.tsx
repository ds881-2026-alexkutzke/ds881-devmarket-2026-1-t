import { Link } from 'react-router-dom';
import type { Product } from '../types/product.types';
import './styles/ProductCard.css';

type ProductCardProps = {
  product: Product;
  conversionRate?: number | null;
};

export default function ProductCard({
  product,
  conversionRate,
}: ProductCardProps) {
  if (!product) {
    return <div className="product-card-error">Erro: Produto não fornecido.</div>;
  }

  const isBRL = conversionRate != null && conversionRate > 0;
  const basePrice = product.price || 0;
  const discount = product.discountPercentage || 0;
  const hasDiscount = discount > 0;

  const actualPrice = hasDiscount ? basePrice * (1 - discount / 100) : basePrice;
  const finalDisplayPrice = isBRL ? actualPrice * conversionRate : actualPrice;
  const originalDisplayPrice = isBRL ? basePrice * conversionRate : basePrice;

  const formattedPrice = new Intl.NumberFormat(isBRL ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: isBRL ? 'BRL' : 'USD',
  }).format(finalDisplayPrice);

  const formattedOriginalPrice = new Intl.NumberFormat(isBRL ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: isBRL ? 'BRL' : 'USD',
  }).format(originalDisplayPrice);

  return (
    <Link to={`/produto/${product.id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-card-image-wrapper">
          {hasDiscount && (
            <span className="product-card-discount">
              -{Math.round(discount)}%
            </span>
          )}
          <img
            src={product.thumbnail || 'https://via.placeholder.com/150'}
            alt={`Imagem de ${product.title || 'Produto'}`}
            className="product-card-thumbnail"
            loading="lazy"
          />
        </div>
        <div className="product-card-content">
          <div className="product-card-header">
            <h3 className="product-card-title" title={product.title || ''}>
              {product.title || 'Produto sem título'}
            </h3>
            <span className="product-card-rating">
              ★ {product.rating ? product.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <div className="product-card-price-container">
            {hasDiscount && (
              <span className="product-card-original-price">{formattedOriginalPrice}</span>
            )}
            <p className="product-card-price">{formattedPrice}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}