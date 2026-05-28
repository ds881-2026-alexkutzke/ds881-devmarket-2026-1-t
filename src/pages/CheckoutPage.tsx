import { useEffect, useState } from "react";
import CepInput from "../components/CepInput";
import AddressFields from "../components/AddressFields";
import { fetchAddressByCep } from "../services/cepService";
import { fetchBRLConversionRate } from "../services/exchangeRateService";
import { formatBRL } from "../utils/formatCurrency";
import type { AddressInfo, BuyerInfo } from "../types/checkout.types";
import { useCart } from "../store/cartStore";
import './styles/CheckoutPage.css';

export default function CheckoutPage() {
  const { state } = useCart();

  const [buyer, setBuyer] = useState<BuyerInfo>({ name: "", email: "", cpf: "" });

  const [cep, setCep] = useState("");
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [number, setNumber] = useState("");

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchBRLConversionRate().then((r) => {
      if (mounted) setRate(r);
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCepComplete(foundCep: string) {
    setCep(foundCep);
    setCepLoading(true);
    setCepError(null);
    try {
      const address = await fetchAddressByCep(foundCep);
      setAddressInfo(address);
    } catch (err: unknown) {
      setAddressInfo(null);
      const message = err instanceof Error ? err.message : "Erro ao buscar CEP";
      setCepError(message);
    } finally {
      setCepLoading(false);
    }
  }

  function handleBuyerChange(field: keyof BuyerInfo, value: string) {
    setBuyer((s) => ({ ...s, [field]: value }));
  }

  const subtotalUSD = state.items.reduce((s, item) => s + item.product.price * item.quantity, 0);
  const totalBRL = rate ? formatBRL(subtotalUSD, rate) : null;

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <section className="checkout-section">
        <div>
          <h2>Dados do comprador</h2>
          <div className="buyer-form">
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

        <div>
          <h2>Endereço</h2>
          <div className="cep-row">
            <CepInput value={cep} onChange={setCep} onCepComplete={handleCepComplete} />
            {cepLoading && <span>Buscando CEP...</span>}
            {cepError && <span className="error">{cepError}</span>}
          </div>

          <AddressFields addressInfo={addressInfo} number={number} onNumberChange={setNumber} />
        </div>

        <div>
          <h2>Resumo do pedido</h2>
          <div>
            {state.items.length === 0 && <p>Seu carrinho está vazio</p>}
            {state.items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div>
                  <strong>{item.product.title}</strong>
                  <div>Quantidade: {item.quantity}</div>
                </div>
                <div>{item.product.price.toFixed(2)} USD</div>
              </div>
            ))}

            <div className="subtotal">
              <strong>Subtotal:</strong> {subtotalUSD.toFixed(2)} USD {rate ? `· ${totalBRL}` : ""}
            </div>
          </div>
        </div>

        <div>
          <button disabled={state.items.length === 0}>Confirmar pedido</button>
        </div>
      </section>
    </main>
  );
}
