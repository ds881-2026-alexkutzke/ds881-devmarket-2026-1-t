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

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://dummyjson.com/products?limit=100');
  if (!response.ok){
    throw new Error('Falha ao buscar a lista de produtos');
  }
  const data = await response.json();
  return data.products;
}

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('https://dummyjson.com/products/categories');
  if(!response.ok){
    throw new Error ('Falha ao buscar categorias');
  }
  const data: Array<{ slug: string}> = await response.json();
  return data.map((category) => category.slug);
}