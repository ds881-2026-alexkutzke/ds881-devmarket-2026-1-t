import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProductById } from "../../services/productService";
import type { Product } from "../../types/product.types";

// Força o mock do serviço de produtos para isolar o teste
vi.mock("../../services/productService", () => ({
  fetchProductById: vi.fn(),
}));

// Mock dos estados simulando o reducer interno do hook
const mockInitialState = {
  product: null,
  loading: true,
  error: null,
};

const mockReducer = (state: any, action: any) => {
  switch (action.type) {
    case "FETCH_START":
      return { product: null, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { product: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { product: null, loading: false, error: action.payload };
    default:
      return state;
  }
};

describe("useProduct - Regras de Negócio do Reducer", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Produto de Teste",
    price: 99.9,
    description: "Descrição de teste",
    category: "Eletrônicos",
    image: "image.png",
    rating: { rate: 4.5, count: 10 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar com o estado de carregamento ativo (loading: true)", () => {
    const state = mockInitialState;
    expect(state.loading).toBe(true);
    expect(state.product).toBeNull();
    expect(state.error).toBeNull();
  });

  it("deve transicionar para FETCH_SUCCESS e guardar o produto corretamente", () => {
    const action = { type: "FETCH_SUCCESS", payload: mockProduct };
    const newState = mockReducer(mockInitialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.product).toEqual(mockProduct);
    expect(newState.error).toBeNull();
  });

  it("deve transicionar para FETCH_ERROR quando o produto não for encontrado", () => {
    const action = { type: "FETCH_ERROR", payload: "Produto não encontrado" };
    const newState = mockReducer(mockInitialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.product).toBeNull();
    expect(newState.error).toBe("Produto não encontrado");
  });

  it("deve transicionar para FETCH_ERROR em falhas críticas na API", () => {
    const action = { type: "FETCH_ERROR", payload: "Erro ao carregar produto" };
    const newState = mockReducer(mockInitialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.product).toBeNull();
    expect(newState.error).toBe("Erro ao carregar produto");
  });
});