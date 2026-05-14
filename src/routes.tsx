import type { RouteObject } from "react-router-dom";

// importação das páginas
import HomePage from "./pages/HomePage";

// placeholders para as outras páginas Modificar depois com as implementações reais
const ProductPage = () => <h1>Produto</h1>;
const CartPage = () => <h1>Carrinho</h1>;
const CheckoutPage = () => <h1>Checkout</h1>;
const PaymentPage = () => <h1>Pagamento</h1>;
const AboutPage = () => <h1>Sobre</h1>;
const NotFoundPage = () => <h1>404 - Página não encontrada</h1>;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/  :id",
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
