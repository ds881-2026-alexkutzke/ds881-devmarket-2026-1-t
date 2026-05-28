import { describe, it, expect, vi, beforeEach } from "vitest";
import { productReducer, initialState } from "../../hooks/useProduct";
import type { Product } from "../../types/product.types";

vi.mock("../../services/productService", () => ({
  fetchProductById: vi.fn(),
}));

describe("useProduct - Regras de Transição do Reducer Real", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Produto de Teste",
    price: 99.9,
    description: "Descrição de teste",
    category: "Eletrônicos",
    images: ["image.png"],
    rating: 4.5,
    discountPercentage: 10,
    stock: 50,
    brand: "Marca de Teste",
    thumbnail: "thumb.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve respeitar o estado inicial correto da aplicação (loading: true)", () => {
    expect(initialState.loading).toBe(true);
    expect(initialState.product).toBeNull();
    expect(initialState.error).toBeNull();
  });

  it("deve transicionar para FETCH_START limpando estados anteriores", () => {
    const dirtyState = { product: mockProduct, loading: false, error: "Erro antigo" };
    const newState = productReducer(dirtyState, { type: "FETCH_START" });

    expect(newState.loading).toBe(true);
    expect(newState.product).toBeNull();
    expect(newState.error).toBeNull();
  });

  it("deve transicionar para FETCH_SUCCESS e armazenar o produto usando o reducer real", () => {
    const newState = productReducer(initialState, { type: "FETCH_SUCCESS", payload: mockProduct });

    expect(newState.loading).toBe(false);
    expect(newState.product).toEqual(mockProduct);
    expect(newState.error).toBeNull();
  });

  it("deve transicionar para FETCH_ERROR repassando a mensagem correta", () => {
    const errorMessage = "Produto não encontrado";
    const newState = productReducer(initialState, { type: "FETCH_ERROR", payload: errorMessage });

    expect(newState.loading).toBe(false);
    expect(newState.product).toBeNull();
    expect(newState.error).toBe(errorMessage);
  });
});