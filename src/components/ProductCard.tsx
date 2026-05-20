import type { Product } from '../types/product.types';
import './styles/ProductCard.css';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) {
    return <div className="product-card-error">Erro: Produto não fornecido.</div>;
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price || 0);

  return (
    <article className="product-card">
      {/* Imagem em miniatura */}
      <div className="product-card-image-wrapper">
        <img 
          src={product.thumbnail || 'https://via.placeholder.com/150'} 
          alt={`Imagem de ${product.title || 'Produto'}`} 
          className="product-card-thumbnail" 
          loading="lazy" 
        />
      </div>

      {/* Informações do Produto */}
      <div className="product-card-content">
        <h3 className="product-card-title" title={product.title || ''}>
          {product.title || 'Produto sem título'}
        </h3>
        <p className="product-card-price">
          {formattedPrice}
        </p>
      </div>
    </article>
  );
}