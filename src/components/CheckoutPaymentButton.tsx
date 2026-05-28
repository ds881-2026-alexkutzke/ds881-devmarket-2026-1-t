import { useNavigate } from "react-router-dom";

import "./styles/CheckoutPaymentButton.css";

type CheckoutPaymentButtonProps = {
  fullName: string;
  email: string;
  cpf: string;
  cep: string;
  addressNumber: string;
};

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isCheckoutPaymentDataValid({
  fullName,
  email,
  cpf,
  cep,
  addressNumber,
}: CheckoutPaymentButtonProps): boolean {
  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim();
  const trimmedAddressNumber = addressNumber.trim();
  const cpfDigits = onlyDigits(cpf);
  const cepDigits = onlyDigits(cep);

  return (
    trimmedName.length > 0 &&
    trimmedEmail.length > 0 &&
    trimmedEmail.includes("@") &&
    cpfDigits.length >= 11 &&
    cepDigits.length === 8 &&
    trimmedAddressNumber.length > 0
  );
}

export default function CheckoutPaymentButton(props: CheckoutPaymentButtonProps) {
  const navigate = useNavigate();
  const isFormValid = isCheckoutPaymentDataValid(props);

  function handleClick() {
    if (isFormValid) {
      navigate("/pagamento");
    }
  }

  return (
    <button
      type="button"
      className="checkout-payment-button"
      disabled={!isFormValid}
      onClick={handleClick}
    >
      Ir para pagamento
    </button>
  );
}
