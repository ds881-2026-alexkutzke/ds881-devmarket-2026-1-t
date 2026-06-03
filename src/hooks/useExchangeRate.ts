import { useState, useEffect, useCallback } from 'react';
import { fetchBRLConversionRate } from '../services/exchangeRateService';

type ExchangeRateState = {
  rate: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useExchangeRate(): ExchangeRateState {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [trigger, setTrigger] = useState(0); 

  useEffect(() => {
    let ignore = false;

    const loadRate = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBRLConversionRate();

        if (!ignore) {
          setRate(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : 'Erro ao buscar taxa de câmbio',
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRate();

    return () => {
      ignore = true;
    };
  }, [trigger]);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  return { rate, loading, error, refetch };
}