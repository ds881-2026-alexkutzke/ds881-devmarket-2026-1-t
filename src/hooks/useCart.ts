import { useCartContext } from "../store/cartContext";

export function useCart() {
  return useCartContext();
}