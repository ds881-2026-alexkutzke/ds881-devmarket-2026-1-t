import { useState } from 'react';
import { fetchAddressByCep as fetchCep } from '../services/cepService';
import type { AddressInfo } from '../types/checkout.types';

export function useCep() {
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCep(cep);
      setAddress(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar o CEP');
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    address,
    loading,
    error,
    fetchAddress,
  };
}
