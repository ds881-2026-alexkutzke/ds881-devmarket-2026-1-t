import { useState, useMemo } from 'react';
// Ajuste os caminhos abaixo conforme a sua estrutura de pastas
import { useProducts } from '../hooks/useProduct'; 
import { useCategories } from '../hooks/useCategories';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

import './styles/HomePage.css';

const HomePage = () => {
  // Consumindo os hooks da camada de negócio em vez de chamar os services diretamente
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // Estados locais para controlar os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Lógica de filtragem: memorizamos o resultado para não recalcular à toa a cada render
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      const matchSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <main className="home-container">
      <header className="home-header">
        <h1>Vitrine DevMarket</h1>
        <p>Encontre os melhores produtos aqui.</p>
        
        <div className="filters-bar">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>
      </header>

      <section className="home-content">
        {productsLoading || categoriesLoading ? (
          <div className="loading-state">Carregando o catálogo...</div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </main>
  );
};

export default HomePage;