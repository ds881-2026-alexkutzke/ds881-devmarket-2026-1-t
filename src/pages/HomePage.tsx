import { useEffect, useState } from 'react';
import { fetchProductById } from '../services/productService';
import type { Product } from '../types/product.types.ts';
import './styles/HomePage.css';

const HomePage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductById(1)
      .then(data => setProduct(data))
      .catch(() => setError('Erro ao carregar produto'));
  }, []);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Carregando prova de conceito...</div>;

  return (
    <main>
      <h1>PoC: Conexão com API</h1>
      <div className="product-card">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Preço: ${product.price}</p>
      </div>
    </main>
  );
};

export default HomePage;
