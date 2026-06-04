import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { fetchBRLConversionRate } from "../services/exchangeRateService";
import { formatBRL } from "../utils/formatCurrency";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductGallery from "../components/ProductGallery";
import ProductRating from "../components/ProductRating";
import StockBadge from "../components/StockBadge";

import "./styles/ProductPage.css";

interface Review {
  reviewerName: string;
  date: string;
  rating: number;
  comment: string;
}

interface Dimensions {
  height: string | number;
  width: string | number;
  depth: string | number;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(Number(id || 0));
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
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isAddedFeedback) return undefined;
    const feedbackTimeout = window.setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
    return () => { window.clearTimeout(feedbackTimeout); };
  }, [isAddedFeedback]);

  if (loading) return <LoadingSpinner />;
  if (error || !product) return <ErrorMessage message="Produto não encontrado." />;

  const isOutOfStock = product.stock === 0;
  const isButtonTemporarilyDisabled = isOutOfStock || isAddedFeedback;

  const handleIncrement = () => {
    if (selectedQuantity < product.stock) setSelectedQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (selectedQuantity > 1) setSelectedQuantity((prev) => prev - 1);
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

  const productDimensions = (product as unknown as { dimensions?: Dimensions }).dimensions;
  const productReviews = (product as unknown as { reviews?: Review[] }).reviews;

  const discount = product.discountPercentage || 0;
  const hasDiscount = discount > 0;
  const basePrice = product.price || 0;
  const actualPrice = hasDiscount ? basePrice * (1 - discount / 100) : basePrice;

  const formatPrice = (priceValue: number) => {
    if (exchangeRate !== null) return formatBRL(priceValue, exchangeRate);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceValue);
  };

  return (
    <div className="product-page">
      <div className="product-page__content">
        <div className="product-page__image-section">
          <ProductGallery 
            images={product.images && product.images.length > 0 ? product.images : [product.thumbnail]} 
          />
        </div>

        <div className="product-page__info-section">
          <h1 className="product-page__title">{product.title}</h1>
          
          <div style={{ marginTop: "-4px", marginBottom: "4px" }}>
            <ProductRating rating={product.rating || 0} />
          </div>
          
          <div className="product-page__meta">
            <p><strong>Marca:</strong> {product.brand}</p>
            <p><strong>Categoria:</strong> {product.category}</p>
          </div>
          
          <p className="product-page__description">{product.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "8px 0" }}>
            <div className="product-page__price-container">
              {hasDiscount && (
                <div className="product-page__price-original-wrapper">
                  <span className="product-page__original-price">{formatPrice(basePrice)}</span>
                  <span className="product-page__discount-badge">-{Math.round(discount)}%</span>
                </div>
              )}
              <div className="product-page__price">{formatPrice(actualPrice)}</div>
            </div>
            <StockBadge stock={product.stock} />
          </div>

          <div className="product-page__quantity-wrapper">
            <span className="product-page__quantity-label">Quantidade</span>
            <div className="product-page__quantity-controls">
              <button className="product-page__quantity-btn" onClick={handleDecrement} disabled={selectedQuantity <= 1 || isOutOfStock}>−</button>
              <span className="product-page__quantity-value">{selectedQuantity}</span>
              <button className="product-page__quantity-btn" onClick={handleIncrement} disabled={selectedQuantity >= product.stock || isOutOfStock}>+</button>
            </div>
          </div>

          <div className="product-page__actions">
            <button onClick={handleAddToCart} disabled={isButtonTemporarilyDisabled} className={`product-page__btn product-page__btn--add ${isAddedFeedback ? "product-page__btn--added" : ""}`}>
              {isOutOfStock ? "Sem estoque" : isAddedFeedback ? "Adicionado! ✓" : "Adicionar ao Carrinho"}
            </button>
            <button onClick={handleBuyNow} disabled={isOutOfStock} className="product-page__btn product-page__btn--buy">Comprar Agora</button>
          </div>
        </div>
      </div>

      <div className="product-page__specs-section">
        <div className="product-page__specs-card">
          <h2 className="product-page__specs-title">Sobre o produto</h2>
          
          <div className="product-page__specs-block">
            <span className="product-page__specs-label">DESCRIÇÃO</span>
            <p className="product-page__specs-text">{product.description}</p>
          </div>

          <div className="product-page__specs-grid">
            <div className="product-page__specs-item">
              <span className="product-page__specs-label">CATEGORIA</span>
              <span className="product-page__specs-value">{product.category}</span>
            </div>
            <div className="product-page__specs-item">
              <span className="product-page__specs-label">MARCA</span>
              <span className="product-page__specs-value">{product.brand}</span>
            </div>
            <div className="product-page__specs-item">
              <span className="product-page__specs-label">ID</span>
              <span className="product-page__specs-value">{product.id || "N/A"}</span>
            </div>
            <div className="product-page__specs-item">
              <span className="product-page__specs-label">DIMENSÕES</span>
              <span className="product-page__specs-value">
                {productDimensions
                  ? `Altura: ${productDimensions.height} · Largura: ${productDimensions.width} · Comprimento: ${productDimensions.depth}`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-page__reviews-section">
        <h2 className="product-page__section-title">Avaliações</h2>
        
        <div className="product-page__reviews-summary">
          <span className="product-page__summary-score">{product.rating?.toFixed(1) || "0.0"}</span>
          <div className="product-page__summary-stars">
            <ProductRating rating={product.rating || 0} />
            <span className="product-page__summary-label">de 5</span>
          </div>
        </div>

        <div className="product-page__reviews-list">
          {productReviews && productReviews.length > 0 ? (
            productReviews.map((review, index) => (
              <div key={`${review.reviewerName}-${review.date}-${index}`} className="product-page__review-card">
                <div className="product-page__review-header">
                  <div className="product-page__review-user-info">
                    <h4 className="product-page__review-author">{review.reviewerName}</h4>
                    <span className="product-page__review-date">
                      {new Date(review.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <ProductRating rating={review.rating} />
                </div>
                <p className="product-page__review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="product-page__no-reviews">Este produto ainda não possui avaliações.</p>
          )}
        </div>
      </div>
    </div>
  );
}