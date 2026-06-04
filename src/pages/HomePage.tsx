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

const PRODUCTS_PER_PAGE = 16;

export default function HomePage() {
  const { products, loading: productsLoading, hasFetchFailed } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { rate, loading: rateLoading, error: rateError } = useExchangeRate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Todos');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setIsSortOpen(false);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter((product) => {
      const matchSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || selectedCategory === 'Todos' || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const isLoading = productsLoading || categoriesLoading || rateLoading;
  const hasError = hasFetchFailed || !!rateError;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategoryChange}
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
          <div className="products-section">
            <div className="sort-container">
              <div className="sort-filter">
                <button type="button" className="sort-filter__toggle" 
                onClick={() => setIsSortOpen(!isSortOpen)}>
                  <span>
                    {sortBy === 'relevance' && 'Relevância'}
                    {sortBy === 'price-low' && 'Menor preço'}
                    {sortBy === 'price-high' && 'Maior preço'}
                  </span>
                  <span className={`sort-filter__arrow ${isSortOpen ? 'sort-filter__arrow--open' : ''}`}>
                    ▼
                  </span>
                </button>
                {isSortOpen && (
                  <ul className="sort-filter__menu">
                    <li>
                      <button type="button"
                      className={`sort-filter__option ${sortBy === 'relevance' ? 'sort-filter__option--active' : ''}`}
                      onClick={() => handleSortChange('relevance')}>
                        Relevância
                      </button>
                    </li>
                    <li>
                      <button type="button"
                      className={`sort-filter__option ${sortBy === 'price-low' ? 'sort-filter__option--active' : ''}`}
                      onClick={() => handleSortChange('price-low')}>
                        Menor preço
                      </button>
                    </li>
                    <li>
                      <button type="button"
                      className={`sort-filter__option ${sortBy === 'price-high' ? 'sort-filter__option--active' : ''}`}
                      onClick={() => handleSortChange('price-high')}>
                        Maior preço
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <ProductGrid products={paginatedProducts} conversionRate={rate} />

            {filteredProducts.length > 0 && (
              <nav className="pagination" aria-label="Paginação de produtos">
                <button
                  type="button"
                  className="pagination__button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                >
                  Anterior
                </button>

                <div className="pagination__pages">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`pagination__page ${
                        safeCurrentPage === pageNumber ? 'pagination__page--active' : ''
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination__button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                >
                  Próxima
                </button>
              </nav>
            )}
          </div>
        )}
      </section>
    </main>
  );
}