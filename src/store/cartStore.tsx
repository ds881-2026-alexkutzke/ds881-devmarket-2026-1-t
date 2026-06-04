import { useCallback, useReducer, type ReactNode,} from "react";
import { CartContext } from "./cartContext";
import type { CartState } from "../types/cart.types";
import type { Product } from "../types/product.types";

const CART_STORAGE_KEY = "@DevMarket:cart";

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: number;
        quantity: number;
      };
    }
  | { type: "CLEAR_CART" };

type CartContextValue = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
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

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(state)
  );
}

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;

      const existingItem = state.items.find(
        item => item.product.id === product.id
      );

      newState = {
        items: existingItem
          ? state.items.map(item =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item
            )
          : [
              ...state.items,
              {
                product,
                quantity: 1,
              },
            ],
      };
      break;
    }

    case "REMOVE_ITEM":
      newState = {
        items: state.items.filter(
          item => item.product.id !== action.payload.id
        ),
      };
      break;

    case "UPDATE_QUANTITY":
      newState = {
        items: state.items.map(item =>
          item.product.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
              }
            : item
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

export function CartProvider({
  children,
}: CartProviderProps) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    loadInitialState
  );

  const addToCart = useCallback(
    (product: Product) => {
      dispatch({
        type: "ADD_ITEM",
        payload: { product },
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (id: number) => {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id },
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          id,
          quantity,
        },
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: productId } });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}