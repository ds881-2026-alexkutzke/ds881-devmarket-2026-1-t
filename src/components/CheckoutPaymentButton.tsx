import { useNavigate } from "react-router-dom";

import "./styles/CheckoutPaymentButton.css";

type CheckoutPaymentButtonProps = {
  fullName: string;
  email: string;
  cpf: string;
  cep: string;
  addressNumber: string;
};

export default function CheckoutPaymentButton(props: CheckoutPaymentButtonProps) {
  const navigate = useNavigate();
  const trimmedName = props.fullName.trim();
  const trimmedEmail = props.email.trim();
  const trimmedAddressNumber = props.addressNumber.trim();
  const cpfDigits = props.cpf.replace(/\D/g, "");
  const cepDigits = props.cep.replace(/\D/g, "");
  const isFormValid =
    trimmedName.length > 0 &&
    trimmedEmail.length > 0 &&
    trimmedEmail.includes("@") &&
    cpfDigits.length >= 11 &&
    cepDigits.length === 8 &&
    trimmedAddressNumber.length > 0;

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
