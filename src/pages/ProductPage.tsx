import { useParams } from 'react-router-dom';
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../store/cartStore";
import type { Product } from "../types/product.types";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  
  const { product, loading, error } = useProduct(Number(id));
  
  const { state, dispatch } = useCart();

  if (loading) {
    return <div className="loading">Carregando produto...</div>;
  } if (error) {
    return <div className="error">Erro: {error}</div>;
  } if (!product) {
    return <div className="not-found">Produto não encontrado.</div>;
  }

  const totalInCart = state.items
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const isOutOfStock = product.stock === 0 || totalInCart >= product.stock;

  const addToCart = (currentProduct: Product) => {
    if (isOutOfStock) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: currentProduct,
        quantity: 1, 
      },
    });
  };

  return (
    <div className="product-detail-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="product-detail-content" style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        <div className="product-image-section" style={{ flex: "1 1 400px" }}>
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f9f9f9" }} 
          />
        </div>
        
        <div className="product-info-section" style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1>{product.title}</h1>
          <p className="brand"><strong>Marca:</strong> {product.brand}</p>
          <p className="category"><strong>Categoria:</strong> {product.category}</p>
          <p className="description" style={{ lineHeight: "1.6", color: "#555" }}>{product.description}</p>
          <div className="price-container" style={{ margin: "10px 0" }}>
            <span className="price" style={{ fontSize: "28px", fontWeight: "bold", color: "#2e7d32" }}>
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <p className="stock-status" style={{ color: isOutOfStock ? "#d32f2f" : "#2e7d32", fontWeight: "500" }}>
            {product.stock === 0 
              ? "Esgotado de momento" 
              : `Disponível em stock: ${product.stock - totalInCart} unidade(s)`}
          </p>
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: isOutOfStock ? "#cccccc" : "#007bff",
              color: isOutOfStock ? "#666666" : "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              marginTop: "12px",
              width: "100%",
              maxWidth: "350px"
            }}
          >
            {isOutOfStock ? "Produto sem estoque" : "Adicionar ao Carrinho"}
          </button>
        </div>

      </div>
    </div>
  );
}