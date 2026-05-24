import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { CartItem, CartState } from "../types/cart.types";

const CART_STORAGE_KEY = "@DevMarket:cart";

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: CartItem["product"]["id"] } }
  | { type: "CLEAR_CART" };

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

function loadInitialState(): CartState {
  if (typeof localStorage === "undefined") {
    return initialState;
  }

  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return initialState;
  }

  try {
    return JSON.parse(savedCart) as CartState;
  } catch {
    return initialState;
  }
}

function persistState(state: CartState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM":
      newState = {
        items: [...state.items, action.payload],
      };
      break;
    case "REMOVE_ITEM":
      newState = {
        items: state.items.filter(
          (item) => item.product.id !== action.payload.id,
        ),
      };
      break;
    case "CLEAR_CART":
      newState = initialState;
      break;
    default:
      newState = state;
  }

  persistState(newState);
  return newState;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
}
