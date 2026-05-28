import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./store/cartStore";
import { routes } from "./routes";
import Layout from "./components/Layout";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {
              routes.map((route, index) =>(
                <Route 
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))
            }
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}