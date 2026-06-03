import { useState, useRef } from 'react';
import CepInput from '../components/CepInput';
import AddressFields from '../components/AddressFields';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { AddressInfo } from '../types/checkout.types';
import { fetchAddressByCep } from '../services/cepService';

export default function CheckoutPage() {
  const [cep, setCep] = useState('');
  const [number, setNumber] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // 1. Cria a referência usando useRef
  const numberInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div>
      <h1>Checkout</h1>
      <CepInput
        value={cep}
        onChange={setCep}
        onCepComplete={handleCepComplete}
      />
      {cepLoading && <LoadingSpinner />}
      {!cepLoading && cepError !== null && <ErrorMessage message={cepError} />}
      <AddressFields
        addressInfo={addressInfo}
        number={number}
        onNumberChange={setNumber}
        numberRef={numberInputRef}
      />
    </div>
  );
}