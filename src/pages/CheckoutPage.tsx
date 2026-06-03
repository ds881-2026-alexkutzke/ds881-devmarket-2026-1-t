import { useState, useRef } from 'react';
import BuyerForm from '../components/BuyerForm';
import CepInput from '../components/CepInput';
import AddressFields from '../components/AddressFields';
import CheckoutPaymentButton from '../components/CheckoutPaymentButton';
import type { AddressInfo, BuyerInfo } from '../types/checkout.types';
import { fetchAddressByCep } from '../services/cepService';

export default function CheckoutPage() {
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    email: '',
    cpf: '',
  });
  const [cep, setCep] = useState('');
  const [number, setNumber] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);

  // 1. Cria a referência usando useRef
  const numberInputRef = useRef<HTMLInputElement>(null);

  const handleCepComplete = async (completedCep: string) => {
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
    }
  };

  const handleBuyerChange = (field: keyof BuyerInfo, value: string) => {
    setBuyerInfo((currentBuyerInfo) => ({
      ...currentBuyerInfo,
      [field]: value,
    }));
  };

  const isCheckoutFormValid =
    buyerInfo.name.trim().length > 0 &&
    buyerInfo.email.trim().includes('@') &&
    buyerInfo.cpf.replace(/\D/g, '').length === 11 &&
    cep.replace(/\D/g, '').length === 8 &&
    number.trim().length > 0;

  return (
    <div>
      <h1>Checkout</h1>
      <BuyerForm
        name={buyerInfo.name}
        email={buyerInfo.email}
        cpf={buyerInfo.cpf}
        onChange={handleBuyerChange}
      />
      <CepInput
        value={cep}
        onChange={setCep}
        onCepComplete={handleCepComplete}
      />
      <AddressFields
        addressInfo={addressInfo}
        number={number}
        onNumberChange={setNumber}
        numberRef={numberInputRef}
      />
      <CheckoutPaymentButton isValid={isCheckoutFormValid} />
    </div>
  );
}
