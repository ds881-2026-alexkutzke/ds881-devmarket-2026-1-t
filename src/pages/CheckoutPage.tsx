import { useState, useRef } from 'react';
import CepInput from '../components/CepInput';
import AddressFields from '../components/AddressFields';
import type { AddressInfo } from '../types/checkout.types';
import { fetchAddressByCep } from '../services/cepService';

export default function CheckoutPage() {
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

  return (
    <div>
      <h1>Checkout</h1>
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
    </div>
  );
}