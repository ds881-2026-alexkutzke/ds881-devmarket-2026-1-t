import { useEffect, useState } from 'react';
import type { Product } from '../types/product.types.ts';
import { fetchProducts } from '../services/productService.ts';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao carregar produtos');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return { products, loading, error };
};
