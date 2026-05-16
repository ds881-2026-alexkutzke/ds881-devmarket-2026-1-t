import type { Product } from '../types/product.types.ts';

export const fetchProductById = async (id: number): Promise<Product | null> => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Falha ao buscar produto');
  }
  return response.json();
}
