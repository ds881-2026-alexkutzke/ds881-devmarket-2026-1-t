import type { AddressInfo } from "../types/checkout.types";
import type { RefObject } from "react";
import './styles/AddressFields.css';

type Props = {
    addressInfo: AddressInfo | null
    number: string
    onNumberChange: (value: string) => void
    numberRef?: RefObject<HTMLInputElement | null>
}

export default function AddressFields({ addressInfo, number, onNumberChange, numberRef }: Props) {
  return (
    <div className="container">
      <div>
        <label htmlFor="street">Logradouro</label>
        <input
          type="street"
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
          ref={numberRef}
          type="text"
          id="number"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="Digite o número"
        />
      </div>
    </div>
  )
}

