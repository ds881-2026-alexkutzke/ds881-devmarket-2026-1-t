import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { fetchBRLConversionRate } from "../services/exchangeRateService";
import { formatBRL } from "../utils/formatCurrency";
import "./styles/ProductPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(Number(id));
  const { items, addToCart } = useCart();

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchBRLConversionRate()
      .then((rate) => {
        if (mounted) setExchangeRate(rate);
      })
      .catch(() => {
        if (mounted) setExchangeRate(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAddedFeedback) {
      return undefined;
    }

    const feedbackTimeout = window.setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);

    return () => {
      window.clearTimeout(feedbackTimeout);
    };
  }, [isAddedFeedback]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return <ErrorMessage message="Produto não encontrado." />;
  }

  const totalInCart = items
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const isOutOfStock = product.stock === 0 || totalInCart >= product.stock;
  const isButtonTemporarilyDisabled = isOutOfStock || isAddedFeedback;

  const handleAddToCart = () => {
    if (isButtonTemporarilyDisabled) return;
    addToCart(product);
    setIsAddedFeedback(true);
  };

  const renderPrice = () => {
    if (exchangeRate !== null) {
      return formatBRL(product.price, exchangeRate);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.price);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Galeria / Imagem do Produto */}
        <div className="product-image-section">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-thumbnail-image"
          />
        </div>

        <div className="product-info-section">
          <h1>{product.title}</h1>
          <p className="brand">
            <strong>Marca:</strong> {product.brand}
          </p>
          <p className="category">
            <strong>Categoria:</strong> {product.category}
          </p>
          <p className="description">{product.description}</p>

          <div className="price-container">
            <span className="price">{renderPrice()}</span>
          </div>

          <p className={`stock-status ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
            {product.stock === 0
              ? "Esgotado de momento"
              : `Disponível em stock: ${product.stock - totalInCart} unidade(s)`}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isButtonTemporarilyDisabled}
            className={`add-to-cart-btn ${isButtonTemporarilyDisabled ? "disabled" : ""} ${isAddedFeedback ? "add-to-cart-btn--added" : ""}`}
          >
            {isOutOfStock
              ? "Produto sem estoque"
              : isAddedFeedback
                ? "Adicionado! ✓"
                : "Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
}
