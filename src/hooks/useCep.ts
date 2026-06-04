import { useState, useRef, useEffect } from "react";
import { fetchAddressByCep } from "../services/cepService";
import type { AddressInfo } from "../types/checkout.types";

export const useCep = () => {
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchAddress = async (cep: string) => {
    setLoading(true);
    setError(null);

    try {
      const addressInfo = await fetchAddressByCep(cep);
      if (!mountedRef.current) return;
      setAddress(addressInfo);
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      setAddress(null);
      setError(err instanceof Error ? err.message : "Erro ao buscar CEP");
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  };

  return {
    address,
    loading,
    error,
    fetchAddress,
  };
};
