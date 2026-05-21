import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/productService';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading };
};