import { useEffect, useRef, useState } from "react";
import type { CartItem } from "../types/cart.types";
import CepInput from "../components/CepInput";
import AddressFields from "../components/AddressFields";
import { useCep } from "../hooks/useCep";
import { fetchBRLConversionRate } from "../services/exchangeRateService";
import { formatBRL } from "../utils/formatCurrency";
import type { BuyerInfo } from "../types/checkout.types";
import { useCart } from "../store/cartStore";
import './styles/CheckoutPage.css';

export default function CheckoutPage() {
  const { state } = useCart();

  const [buyer, setBuyer] = useState<BuyerInfo>({ name: "", email: "", cpf: "" });

  const [cep, setCep] = useState("");
  const [number, setNumber] = useState("");
  const numberRef = useRef<HTMLInputElement | null>(null);

  const { address: addressInfo, loading: cepLoading, error: cepError, fetchAddress } = useCep();

  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchBRLConversionRate()
      .then((r) => {
        if (mounted) setRate(r);
      })
      .catch((err: unknown) => {
        console.error("Erro ao buscar taxa de câmbio:", err);
        if (mounted) setRate(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCepComplete(foundCep: string) {
    setCep(foundCep);
    await fetchAddress(foundCep);

    if (numberRef.current) {
      numberRef.current.focus();
    }
  }

  function handleBuyerChange(field: keyof BuyerInfo, value: string) {
    setBuyer((s) => ({ ...s, [field]: value }));
  }

  const isFormValid =
    buyer.name.trim().length > 0 &&
    buyer.email.trim().length > 0 &&
    buyer.email.includes("@") &&
    buyer.cpf.replace(/\D/g, "").length >= 11 &&
    cep.replace(/\D/g, "").length === 8 &&
    number.trim().length > 0 &&
    state.items.length > 0;

  const subtotalUSD = state.items.reduce((s, item: CartItem) => s + item.product.price * item.quantity, 0);
  const totalBRL = rate ? formatBRL(subtotalUSD, rate) : null;

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <section className="checkout-page__section">
        <div className="checkout-page__card">
          <h2>Dados do comprador</h2>
          <div className="checkout-page__buyer-form">
            <input
              placeholder="Nome"
              value={buyer.name}
              onChange={(e) => handleBuyerChange("name", e.target.value)}
            />
            <input
              placeholder="E-mail"
              value={buyer.email}
              onChange={(e) => handleBuyerChange("email", e.target.value)}
            />
            <input
              placeholder="CPF"
              inputMode="numeric"
              value={buyer.cpf}
              onChange={(e) => handleBuyerChange("cpf", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div className="checkout-page__card">
          <h2>Endereço</h2>
          <div className="checkout-page__cep-row">
            <CepInput value={cep} onChange={setCep} onCepComplete={handleCepComplete} />
            {cepLoading && <span>Buscando CEP...</span>}
            {cepError && <span className="error">{cepError}</span>}
          </div>

          <AddressFields
            addressInfo={addressInfo}
            number={number}
            onNumberChange={setNumber}
            numberRef={numberRef}
          />
        </div>

        <div className="checkout-page__card">
          <h2>Resumo do pedido</h2>
          <div>
            {state.items.length === 0 && <p>Seu carrinho está vazio</p>}
            {state.items.map((item: CartItem) => (
              <div key={item.product.id} className="checkout-page__cart-item">
                <div>
                  <strong>{item.product.title}</strong>
                  <div>Quantidade: {item.quantity}</div>
                </div>
                <div>{item.product.price.toFixed(2)} USD</div>
              </div>
            ))}

            <div className="checkout-page__subtotal">
              <strong>Subtotal:</strong> {subtotalUSD.toFixed(2)} USD {rate ? `· ${totalBRL}` : ""}
            </div>
          </div>
        </div>

        <div>
          <button disabled={!isFormValid}>Confirmar pedido</button>
        </div>
      </section>
    </main>
  );
}
