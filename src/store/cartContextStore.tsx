import { createContext } from "react";
import type { CartItem } from "../types/cart.types";
import type { Product } from "../types/product.types";

export type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
};

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);