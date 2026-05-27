import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/productService';
import type { Product } from '../types/product.types';

export const useProduct = (id: number): { product: Product | null; loading: boolean; error: string | null } => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (data === null) {
          setError('Produto não encontrado');
        } else {
          setProduct(data);
        }
      } catch {
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return { product, loading, error };
};