// src/services/exchangeRateService.ts

export const fetchBRLConversionRate = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rates.BRL;
  } catch { 
    // Retorna null em caso de falha para ativar o fallback seguro em USD
    return null; 
  }
};

export const fetchUsdToBrl = async (): Promise<number> => {
  const response = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!response.ok) {
    throw new Error('Falha ao buscar taxa USD/BRL');
  }
  const data = await response.json();
  if (!data.rates?.BRL) {
    throw new Error('Retorno da API não contêm dados BRL');
  }
  return data.rates.BRL;
};