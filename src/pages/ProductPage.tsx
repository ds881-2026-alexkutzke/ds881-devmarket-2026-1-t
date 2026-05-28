import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../store/cartStore";
import type { Product } from "../types/product.types";
import "./styles/ProductPage.css";

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
    <div className="product-detail-container">
      <div className="product-detail-content">
        
        
        <div className="product-image-section">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="product-thumbnail-image"
          />
        </div>
        
       
        <div className="product-info-section">
          <h1>{product.title}</h1>
          <p className="brand"><strong>Marca:</strong> {product.brand}</p>
          <p className="category"><strong>Categoria:</strong> {product.category}</p>
          <p className="description">{product.description}</p>
          
          <div className="price-container">
            <span className="price">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          
          <p className={`stock-status ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
            {product.stock === 0 
              ? "Esgotado de momento" 
              : `Disponível em stock: ${product.stock - totalInCart} unidade(s)`}
          </p>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`add-to-cart-btn ${isOutOfStock ? "disabled" : ""}`}
          >
            {isOutOfStock ? "Produto sem estoque" : "Adicionar ao Carrinho"}
          </button>
        </div>

      </div>
    </div>
  );
}