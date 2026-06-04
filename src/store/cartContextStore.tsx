import { createContext, useContext, type Dispatch } from "react";
import type { CartItem, CartState } from "../types/cart.types";
import type { Product } from "../types/product.types";

export type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "DECREMENT_ITEM"; payload: { id: CartItem["product"]["id"] } }
  | { type: "REMOVE_ITEM"; payload: { id: CartItem["product"]["id"] } }
  | { type: "UPDATE_QUANTITY"; payload: { id: CartItem["product"]["id"]; quantity: number } }
  | { type: "CLEAR_CART" };

export type CartContextValue = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  decrementItem: (id: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
}