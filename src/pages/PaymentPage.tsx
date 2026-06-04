import { useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { generatePixPayload } from "../utils/pixGenerator";
import { formatBRL } from "../utils/formatCurrency";
import CartSummary from "../components/CartSummary";
import OrderSummary from "../components/OrderSummary";
import PixQRCode from "../components/PixQRCode";
import "./styles/PaymentPage.css";

export default function PaymentPage() {
  const { state } = useCart();
  const { rate, loading, error } = useExchangeRate();
  const [copied, setCopied] = useState(false);

  const totalUsd = useMemo(
    () => state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [state.items]
  );

  const totalBrl = useMemo(() => {
    return rate ? totalUsd * rate : 0;
  }, [totalUsd, rate]);

  const pixPayload = useMemo(() => {
    if (!rate || totalBrl === 0) return "";
    return generatePixPayload(totalBrl);
  }, [totalBrl, rate]);

  const handleCopyPix = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="payment-page">
      <h1 className="payment-page__header">Pagamento</h1>
      
      <div className="payment-page__content">
        {error && (
          <div role="alert" className="payment-page__error">
            Não foi possível carregar a taxa de câmbio: {error}
          </div>
        )}

        <div className="payment-page__grid">
          <div className="payment-page__summary-section">
            {rate !== null ? (
              <OrderSummary items={state.items} rate={rate} />
            ) : (
              <p className="payment-page__loading-text">Carregando resumo do pedido...</p>
            )}
            <CartSummary items={state.items} rate={rate} />
            
            <button className="payment-page__back-btn" onClick={() => window.history.back()}>
              ← Voltar para o Carrinho
            </button>
          </div>

          <div className="pix-payment">
            <h2 className="pix-payment__title">Pagamento por PIX</h2>
            
            {loading ? (
              <p className="payment-page__loading-text">Carregando taxa de câmbio para gerar Pix...</p>
            ) : (
              <>
                <PixQRCode payload={pixPayload} />
                
                {rate && (
                  <p className="pix-payment__amount">
                    Total a pagar: <strong>{formatBRL(totalUsd, rate)}</strong>
                  </p>
                )}

                <button 
                  className="pix-payment__copy-btn" 
                  onClick={handleCopyPix}
                  disabled={!pixPayload}
                >
                  {copied ? "✓ Código Copiado!" : "Copiar Código Pix (Copia e Cola)"}
                </button>

                <p className="pix-payment__note">
                  Abra o app do seu banco e escolha a opção Pix Copia e Cola ou escaneie o QR Code.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}