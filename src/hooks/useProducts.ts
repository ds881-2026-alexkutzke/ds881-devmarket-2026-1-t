import { useEffect, useState } from "react";
import type { Product } from "../types/product.types";
import { fetchProducts } from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasFetchFailed, setHasFetchFailed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (e) {
        setProducts([]);
        setHasFetchFailed(true);
        return;
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, hasFetchFailed };
};