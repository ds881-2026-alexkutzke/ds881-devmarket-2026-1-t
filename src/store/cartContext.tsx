import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: number;
        quantity: number;
      };
    };

interface CartContextData {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextData | null>(null);

const initialState: CartState = {
  items: [],
};

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + action.payload.quantity,
                }
              : item
          ),
        };
      }

      return {
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        items: state.items.filter(
          item => item.id !== action.payload
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
              }
            : item
        ),
      };

    default:
      return state;
  }
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState
  );

  const addToCart = (item: CartItem) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: item,
    });
  };

  const removeFromCart = (id: number) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: id,
    });
  };

  const updateQuantity = (
    id: number,
    quantity: number
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        id,
        quantity,
      },
    });
  };

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

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartContext must be used within CartProvider"
    );
  }

  return context;
}