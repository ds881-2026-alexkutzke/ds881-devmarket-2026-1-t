import './styles/HomePage.css';
import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import { useCategories } from '../hooks/useCategories';
import { useExchangeRate } from '../hooks/useExchangeRate';
import CategoryFilter from '../components/CategoryFilter';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const { products, loading: productsLoading, hasFetchFailed } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { rate, loading: rateLoading, error: rateError } = useExchangeRate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Todos');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || selectedCategory === 'Todos' || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const isLoading = productsLoading || categoriesLoading || rateLoading;
  const hasError = hasFetchFailed || !!rateError;

  return (
    <main className="home-container">
      <header className="home-header">
        <h1 className="title">
          Vitrine <span className="highlight">DevMarket</span>
        </h1>
        <p className="subtitle">
          Explore nossa coleção e encontre as melhores ferramentas para o seu próximo projeto.
        </p>

        <div className="filters-bar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>

      <section className="home-content">
        {hasError ? (
          <ErrorMessage
            message={
              rateError ||
              'Erro ao carregar o catálogo de produtos. Recarregue a página e tente novamente.'
            }
          />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : (
          <ProductGrid products={filteredProducts} conversionRate={rate} />
        )}
      </section>
    </main>
  );
}

