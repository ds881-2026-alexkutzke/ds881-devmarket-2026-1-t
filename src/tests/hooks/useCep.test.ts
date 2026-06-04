import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCep } from "../../hooks/useCep";
import { fetchAddressByCep } from "../../services/cepService";
import type { AddressInfo } from "../../types/checkout.types";

vi.mock("../../services/cepService", () => ({
  fetchAddressByCep: vi.fn(),
}));

describe("useCep Hook", () => {
  const mockAddress: AddressInfo = {
    cep: "01001000",
    street: "Praca da Se",
    neighborhood: "Se",
    city: "Sao Paulo",
    state: "SP",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve iniciar com os estados corretos", () => {
    const { result } = renderHook(() => useCep());

    expect(result.current.address).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve buscar endereco pelo CEP com sucesso", async () => {
    vi.mocked(fetchAddressByCep).mockResolvedValue(mockAddress);
    const { result } = renderHook(() => useCep());

    await act(async () => {
      await result.current.fetchAddress("01001-000");
    });

    expect(fetchAddressByCep).toHaveBeenCalledWith("01001-000");
    expect(result.current.address).toEqual(mockAddress);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve preencher erro quando a busca falhar", async () => {
    vi.mocked(fetchAddressByCep).mockRejectedValue(new Error("CEP nao encontrado"));
    const { result } = renderHook(() => useCep());

    await act(async () => {
      await result.current.fetchAddress("00000-000");
    });

    expect(result.current.address).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("CEP nao encontrado");
  });

  it("deve indicar loading enquanto a busca estiver pendente", async () => {
    let resolvePromise!: (value: AddressInfo) => void;
    const promise = new Promise<AddressInfo>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(fetchAddressByCep).mockReturnValue(promise);
    const { result } = renderHook(() => useCep());

    act(() => {
      void result.current.fetchAddress("01001-000");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise(mockAddress);
      await promise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
