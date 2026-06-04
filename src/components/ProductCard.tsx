import type { Product } from '../types/product.types';
import './styles/ProductCard.css';
import { useCart } from "../hooks/useCart";

type ProductCardProps = {
  product: Product;
  // Nova prop opcional para receber a cotação da página
  conversionRate?: number | null; 
};

export default function ProductCard({ product, conversionRate }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };
  
  if (!product) {
    return <div className="product-card-error">Erro: Produto não fornecido.</div>;
  }

  // Verifica se a cotação foi passada e é válida
  const isBRL = conversionRate != null && conversionRate > 0;
  
  // Calcula o preço final com base na moeda
  const finalPrice = isBRL ? (product.price || 0) * conversionRate : (product.price || 0);

  // Formata dinamicamente
  const formattedPrice = new Intl.NumberFormat(isBRL ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: isBRL ? 'BRL' : 'USD',
  }).format(finalPrice);

  return (
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
        
        <p className="product-card-price">
          {formattedPrice}
        </p>

        <button type="button" onClick={handleAddToCart}>
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}