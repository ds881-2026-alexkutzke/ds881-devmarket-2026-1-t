import "./styles/CepInput.css";

type CepInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCepComplete: (cep: string) => void;
};

function sanitizeCep(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export default function CepInput({
  value,
  onChange,
  onCepComplete,
}: CepInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const sanitizedValue = sanitizeCep(event.target.value);

    onChange(sanitizedValue);

    if (sanitizedValue.length === 8) {
      onCepComplete(sanitizedValue);
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      maxLength={8}
      placeholder="Digite o CEP"
      className="cep-input__field"
    />
  );
}
