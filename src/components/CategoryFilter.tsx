import { useState, useRef, useEffect } from 'react';
import './styles/CategoryFilter.css';

type CategoryFilterProps = {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
};

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cat: string | null) => {
    onSelect(cat);
    setOpen(false);
  };

  const displayLabel = selected ?? 'Todos';

  return (
    <div className="category-filter" ref={dropdownRef}>
      <button
        type="button"
        className="category-filter__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="category-filter__label">{displayLabel}</span>
        <span className={`category-filter__arrow ${open ? 'category-filter__arrow--open' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <ul className="category-filter__menu" role="listbox" aria-label="Filtro de categorias">
          <li>
            <button
              type="button"
              className={`category-filter__option ${
                selected === null || selected === 'Todos' ? 'category-filter__option--active' : ''
              }`}
              onClick={() => handleSelect(null)}
              role="option"
              aria-selected={selected === null || selected === 'Todos'}
            >
              Todos
            </button>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                className={`category-filter__option ${selected === category ? 'category-filter__option--active' : ''}`}
                onClick={() => handleSelect(category)}
                role="option"
                aria-selected={selected === category}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
