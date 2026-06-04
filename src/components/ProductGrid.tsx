import type { Product } from "../types/product.types";
import ProductCard from "./ProductCard";
import './styles/ProductGrid.css';

type ProductGridProps = {
  products: Product[];
  conversionRate?: number | null;
};

export default function ProductGrid({ products, conversionRate }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.length > 0 
        ? products.map((product) => (
          <ProductCard key={product.id} product={product} conversionRate={conversionRate} />
        ))
        : <p className="product-grid_empty">Nenhum produto disponível no momento.</p>
      }
      </div>
  );
}