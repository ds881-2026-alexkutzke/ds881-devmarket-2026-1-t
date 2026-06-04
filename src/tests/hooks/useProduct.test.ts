import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProduct } from "../../hooks/useProduct";
import { fetchProductById } from "../../services/productService";
import type { Product } from "../../types/product.types";


vi.mock("../../services/productService", () => ({
  fetchProductById: vi.fn(),
}));

describe("useProduct Hook", () => {
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
    brand: "Marca",
    thumbnail: "thumb.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar com os estados corretos (loading: true, product: null, error: null)", () => {
    vi.mocked(fetchProductById).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProduct(1));

    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("deve carregar o produto com sucesso", async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);
    const { result } = renderHook(() => useProduct(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
  });

  it("deve preencher erro quando a API retornar null", async () => {
    vi.mocked(fetchProductById).mockResolvedValue(null);
    const { result } = renderHook(() => useProduct(2));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBe("Produto não encontrado");
  });

  it("deve preencher erro quando a API lançar uma exceção", async () => {
    vi.mocked(fetchProductById).mockRejectedValue(new Error("Network Error"));
    const { result } = renderHook(() => useProduct(3));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBe("Erro ao carregar produto");
  });

  it("deve reiniciar o loading ao trocar de id e carregar o novo produto", async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: 1 },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newProduct = { ...mockProduct, id: 2, title: "Novo Produto" };
    vi.mocked(fetchProductById).mockResolvedValue(newProduct);

    rerender({ id: 2 });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(newProduct);
  });

  it("não deve atualizar o estado se o componente sofrer unmount durante a requisição", async () => {
    let resolvePromise!: (value: Product | null) => void;
    const promise = new Promise<Product | null>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(fetchProductById).mockReturnValue(promise);

    const { result, unmount } = renderHook(() => useProduct(1));

    unmount();
    resolvePromise(mockProduct);

    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
  });

  it("deve evitar race condition em trocas rápidas de id", async () => {
    let resolveFirst!: (value: Product | null) => void;
    const firstPromise = new Promise<Product | null>((resolve) => {
      resolveFirst = resolve;
    });

    let resolveSecond!: (value: Product | null) => void;
    const secondPromise = new Promise<Product | null>((resolve) => {
      resolveSecond = resolve;
    });

    vi.mocked(fetchProductById)
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: 1 },
    });

    rerender({ id: 2 });

    const product2 = { ...mockProduct, id: 2, title: "Produto 2" };
    resolveSecond(product2);
    resolveFirst(mockProduct); 

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(product2);
  });
});