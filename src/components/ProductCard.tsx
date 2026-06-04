import { useCart } from "../hooks/useCart";
import type { Product } from "../types/product.types";
import "./styles/ProductCard.css";

type ProductCardProps = {
  product: Product;
  conversionRate?: number | null;
};

export default function ProductCard({
  product,
  conversionRate,
}: ProductCardProps) {
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="product-card-error">
        Erro: Produto não fornecido.
      </div>
    );
  }

  const isBRL = conversionRate != null && conversionRate > 0;

  const finalPrice = isBRL
    ? (product.price || 0) * conversionRate
    : (product.price || 0);

  const formattedPrice = new Intl.NumberFormat(
    isBRL ? "pt-BR" : "en-US",
    {
      style: "currency",
      currency: isBRL ? "BRL" : "USD",
    }
  ).format(finalPrice);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.thumbnail || "https://via.placeholder.com/150"}
          alt={`Imagem de ${product.title || "Produto"}`}
          className="product-card-thumbnail"
          loading="lazy"
        />
      </div>

      <div className="product-card-content">
        <h3
          className="product-card-title"
          title={product.title || ""}
        >
          {product.title || "Produto sem título"}
        </h3>

        <p className="product-card-price">
          {formattedPrice}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}