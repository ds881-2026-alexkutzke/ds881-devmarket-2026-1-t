import { Product } from '../types/product.types'; // Importando o tipo centralizado
import './styles/ProductCard.css'; // Importando o CSS que criamos

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Formata o preço para USD (Dólar Americano)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <article className="product-card">
      {/* Imagem em miniatura */}
      <div className="product-card-image-wrapper">
        <img 
          src={product.thumbnail} 
          alt={`Imagem de ${product.title}`} 
          className="product-card-thumbnail" 
          loading="lazy" 
        />
      </div>

      {/* Informações do Produto */}
      <div className="product-card-content">
        <h3 className="product-card-title" title={product.title}>
          {product.title}
        </h3>
        <p className="product-card-price">
          {formattedPrice}
        </p>
      </div>
    </article>
  );
}