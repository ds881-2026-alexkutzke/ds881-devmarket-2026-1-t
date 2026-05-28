import type { RefObject } from "react";
import type { AddressInfo } from "../types/checkout.types"
import './styles/AddressFields.css';

type Props = {
    addressInfo: AddressInfo | null
    number: string
    onNumberChange: (value: string) => void
    numberRef?: RefObject<HTMLInputElement | null>
}

export default function AddressFields({ addressInfo, number, onNumberChange, numberRef}: Props) {
  return (
    <div className="container">
      {/* ... (os outros campos continuam iguais) ... */}
      <div>
        <label htmlFor="logradouro">Logradouro</label> {/* <-- Corrigido para logradouro */}
        <input
          type="text" {/* <-- Corrigido para text */}
          id="logradouro"
          value={addressInfo?.street || ''}
          readOnly
          tabIndex={-1}
          className="readOnly"
        />
      </div>

      <div>
        <label htmlFor="neighborhood">Bairro</label>
        <input
          type="text"
          id="neighborhood"
          value={addressInfo?.neighborhood || ''}
          readOnly
          tabIndex={-1}
          className="readOnly"
        />
      </div>

      <div>
        <label htmlFor="city">Cidade</label>
        <input
          type="text"
          id="city"
          value={addressInfo?.city || ''}
          readOnly
          tabIndex={-1}
          className="readOnly"
        />
      </div>

      <div>
        <label htmlFor="state">UF</label>
        <input
          type="text"
          id="state"
          value={addressInfo?.state || ''}
          readOnly
          tabIndex={-1}
          className="readOnly"
        />
      </div>

      <div>
        <label htmlFor="number">Número</label>
        <input
          type="text"
          id="number"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="Digite o número"
          ref={numberRef} // <-- Ref conectada ao input
        />
      </div>
    </div>
  )
}