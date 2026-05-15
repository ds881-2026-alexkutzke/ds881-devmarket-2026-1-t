import type { RouteObject } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/produto/:id",
    element: <ProductPage />,
  },
  {
    path: "/carrinho",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/pagamento",
    element: <PaymentPage />,
  },
  {
    path: "/sobre",
    element: <AboutPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
