import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { fetchBRLConversionRate } from "../services/exchangeRateService";
import { formatBRL } from "../utils/formatCurrency";
import "./styles/ProductPage.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(Number(id));
  const { addToCart } = useCart();

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);

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

  const isOutOfStock = product.stock === 0;
  const isButtonTemporarilyDisabled = isOutOfStock || isAddedFeedback;

  const handleIncrement = () => {
    if (selectedQuantity < product.stock) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isButtonTemporarilyDisabled) return;
    
    addToCart(product, selectedQuantity);
    setIsAddedFeedback(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    addToCart(product, selectedQuantity); 
    navigate("/carrinho");
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
    <div className="product-page">
      <div className="product-page__content">
        <div className="product-page__image-section">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-page__thumbnail"
          />
        </div>

        <div className="product-page__info-section">
          <h1 className="product-page__title">{product.title}</h1>
          
          <div className="product-page__meta">
            <p><strong>Marca:</strong> {product.brand}</p>
            <p><strong>Categoria:</strong> {product.category}</p>
          </div>
          
          <p className="product-page__description">{product.description}</p>

          <div className="product-page__price">
            {renderPrice()}
          </div>

          <div className="product-page__quantity-wrapper">
            <span className="product-page__quantity-label">Quantidade</span>
            
            <div className="product-page__quantity-controls">
              <button
                className="product-page__quantity-btn"
                onClick={handleDecrement}
                disabled={selectedQuantity <= 1 || isOutOfStock}
              >
                −
              </button>
              <span className="product-page__quantity-value">{selectedQuantity}</span>
              <button
                className="product-page__quantity-btn"
                onClick={handleIncrement}
                disabled={selectedQuantity >= product.stock || isOutOfStock}
              >
                +
              </button>
            </div>
            
            <span className={`product-page__stock-text ${isOutOfStock ? "product-page__stock-text--out" : ""}`}>
              {isOutOfStock ? "Esgotado no momento" : `${product.stock} peças disponíveis`}
            </span>
          </div>

          <div className="product-page__actions">
            <button
              onClick={handleAddToCart}
              disabled={isButtonTemporarilyDisabled}
              className={`product-page__btn product-page__btn--add ${isAddedFeedback ? "product-page__btn--added" : ""}`}
            >
              {isOutOfStock
                ? "Sem estoque"
                : isAddedFeedback
                  ? "Adicionado! ✓"
                  : "Adicionar ao Carrinho"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="product-page__btn product-page__btn--buy"
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}