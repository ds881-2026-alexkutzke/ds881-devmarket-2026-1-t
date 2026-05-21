import './styles/CategoryFilter.css';

type CategoryFilterProps = {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
};

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <nav className="category-filter" aria-label="Filtro de categorias">
      <ul className="category-filter__list">
        <li>
          <button
            type="button"
            className={`category-filter__button ${selected === null ? 'category-filter__button--active' : ''}`}
            onClick={() => onSelect(null)}
            aria-pressed={selected === null}
          >
            Todos
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              type="button"
              className={`category-filter__button ${selected === category ? 'category-filter__button--active' : ''}`}
              onClick={() => onSelect(category)}
              aria-pressed={selected === category}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryFilter;
