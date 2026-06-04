import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressFields from '../components/AddressFields';
import BuyerForm from '../components/BuyerForm';
import CepInput from '../components/CepInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchAddressByCep } from '../services/cepService';
import type { AddressInfo, BuyerInfo } from '../types/checkout.types';
import './styles/CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [number, setNumber] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    email: '',
    cpf: '',
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // 1. Cria a referência usando useRef
  const numberInputRef = useRef<HTMLInputElement>(null);

  const handleBuyerChange = (field: keyof BuyerInfo, value: string) => {
    setBuyerInfo((currentBuyerInfo) => ({
      ...currentBuyerInfo,
      [field]: value,
    }));
  };

  const handleCepComplete = async (completedCep: string) => {
    setCepLoading(true);
    setCepError(null);

    try {
      // Chama o serviço. Se o CEP for inválido, o serviço lançará um erro.
      const data = await fetchAddressByCep(completedCep);

      setAddressInfo(data);

      // 2. Foco ocorre apenas em caso de sucesso (se chegou aqui, não deu erro)
      if (numberInputRef.current) {
        numberInputRef.current.focus();
      }
    } catch {
      // 3. Foco NÃO ocorre em caso de erro na consulta
      // Limpamos os dados e garantimos silêncio (sem console.log)
      setAddressInfo(null);
      setCepError('CEP inválido ou não encontrado');
    } finally {
      setCepLoading(false);
    }
  };

  const cpfDigits = buyerInfo.cpf.replace(/\D/g, '');
  const isPaymentDisabled =
    buyerInfo.name.trim() === '' ||
    buyerInfo.email.trim() === '' ||
    cep.trim() === '' ||
    addressInfo === null ||
    cpfDigits.length !== 11;

  return (
    <main className="checkout-page">
      <div className="checkout-page__hero">
        <h1>Checkout</h1>
        <p className="checkout-page__subtitle">
          Preencha os dados do comprador e confirme o endereco para seguir para o pagamento.
        </p>
      </div>

      <div className="checkout-page__content">
        <section className="checkout-page__card" aria-labelledby="buyer-section-title">
          <div className="checkout-page__section-header">
            <h2 id="buyer-section-title">Dados do comprador</h2>
            <p>Essas informacoes serao usadas para identificar a compra.</p>
          </div>
          <BuyerForm
            name={buyerInfo.name}
            email={buyerInfo.email}
            cpf={buyerInfo.cpf}
            onChange={handleBuyerChange}
          />
        </section>

        <section className="checkout-page__card" aria-labelledby="address-section-title">
          <div className="checkout-page__section-header">
            <h2 id="address-section-title">Endereco de entrega</h2>
            <p>Informe o CEP para preencher o endereco automaticamente.</p>
          </div>

          <div className="checkout-page__cep-block">
            <span className="checkout-page__field-label">CEP</span>
            <CepInput
              value={cep}
              onChange={setCep}
              onCepComplete={handleCepComplete}
            />
          </div>

          {cepLoading && <LoadingSpinner />}
          {!cepLoading && cepError !== null && <ErrorMessage message={cepError} />}

          <div className="checkout-page__address">
            <AddressFields
              addressInfo={addressInfo}
              number={number}
              onNumberChange={setNumber}
              numberRef={numberInputRef}
            />
          </div>
        </section>

        <div className="checkout-page__actions">
          <button
            className="checkout-page__button"
            type="button"
            disabled={isPaymentDisabled}
            onClick={() => navigate('/pagamento')}
          >
            Ir para pagamento
          </button>
        </div>
      </div>
    </main>
  );
}
