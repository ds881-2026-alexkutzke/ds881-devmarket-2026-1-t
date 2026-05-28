import type { Product } from "../types/product.types";
import ProductCard from "./ProductCard";
import './styles/ProductGrid.css';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.length > 0 
        ? products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
        : <p className="product-grid__empty">Nenhum produto disponível no momento.</p>
      }
    </div>
  );
}