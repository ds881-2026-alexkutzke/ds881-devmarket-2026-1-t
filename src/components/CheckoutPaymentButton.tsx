import { useNavigate } from "react-router-dom";

import "./styles/CheckoutPaymentButton.css";

type CheckoutPaymentButtonProps = {
  isValid: boolean;
};

export default function CheckoutPaymentButton({ isValid }: CheckoutPaymentButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (isValid) {
      navigate("/pagamento");
    }
  }

  return (
    <button
      type="button"
      className="checkout-payment-button"
      disabled={!isValid}
      onClick={handleClick}
    >
      Ir para pagamento
    </button>
  );
}
