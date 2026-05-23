import { createContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { CartState } from "../types/cart.types";

type CartAction = {
  type: string;
};

type CartContextValue = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
};

type CartProviderProps = {
  children: ReactNode;
};

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
