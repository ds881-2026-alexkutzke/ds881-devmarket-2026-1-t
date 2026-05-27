import { useReducer, useEffect } from 'react';
import { fetchProductById } from '../services/productService';
import type { Product } from '../types/product.types';

type State = {
  product: Product | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product }
  | { type: 'FETCH_ERROR'; payload: string };

const initialState: State = {
  product: null,
  loading: true,
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { product: null, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { product: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { product: null, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useProduct = (id: number): State => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (data === null) {
          dispatch({ type: 'FETCH_ERROR', payload: 'Produto não encontrado' });
        } else {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch {
        dispatch({ type: 'FETCH_ERROR', payload: 'Erro ao carregar produto' });
      }
    };

    loadProduct();
  }, [id]);

  return state;
};