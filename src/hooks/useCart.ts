import { useContext } from "react";
import { CartContext, type CartContextValue } from "../store/cartContext";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart deve ser usado dentro de um CartProvider"
    );
  }

  return context;
}