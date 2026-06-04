export function generatePixPayload(value: number): string {
  return `PIX-PAYMENT|VALUE:${value.toFixed(2)}`;
}
