export function formatBRL(valueInUsd: number, rate: number): string {
  const valueInBRL = valueInUsd * rate;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInBRL);
}