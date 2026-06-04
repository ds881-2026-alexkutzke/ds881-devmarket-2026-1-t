import { useCallback, useReducer, type ReactNode } from "react";
import { CartContext, type CartAction } from "./cartContextStore";
import type { CartState } from "../types/cart.types";
import type { Product } from "../types/product.types";

const CART_STORAGE_KEY = "devmarket_cart";

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

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id,
      );

      newState = {
        items: existingItem
          ? state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...state.items, { product, quantity: 1 }],
      };
      break;
    }

    case "DECREMENT_ITEM": {
      const item = state.items.find((i) => i.product.id === action.payload.id);
      if (!item) return state;

      newState =
        item.quantity <= 1
          ? { items: state.items.filter((i) => i.product.id !== action.payload.id) }
          : {
              items: state.items.map((i) =>
                i.product.id === action.payload.id
                  ? { ...i, quantity: i.quantity - 1 }
                  : i,
              ),
            };
      break;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        newState = {
          items: state.items.filter((item) => item.product.id !== id),
        };
      } else {
        newState = {
          items: state.items.map((item) =>
            item.product.id === id ? { ...item, quantity } : item,
          ),
        };
      }
      break;
    }

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

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: { product } });
  }, []);

  const decrementItem = useCallback((id: number) => {
    dispatch({ type: "DECREMENT_ITEM", payload: { id } });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: productId } });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        decrementItem,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}