import './styles/BuyerForm.css';

type BuyerField = 'name' | 'email' | 'cpf';

type BuyerFormProps = {
  name: string;
  email: string;
  cpf: string;
  onChange: (field: BuyerField, value: string) => void;
};

export default function BuyerForm({ name, email, cpf, onChange }: BuyerFormProps) {
  return (
    <section className="buyer-form" aria-labelledby="buyer-form-title">
      <h2 id="buyer-form-title" className="buyer-form__title">Dados do comprador</h2>

      <div className="buyer-form__field">
        <label htmlFor="buyer-name" className="buyer-form__label">Nome completo</label>
        <input
          id="buyer-name"
          name="name"
          type="text"
          className="buyer-form__input"
          value={name}
          onChange={(event) => onChange('name', event.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="buyer-form__field">
        <label htmlFor="buyer-email" className="buyer-form__label">E-mail</label>
        <input
          id="buyer-email"
          name="email"
          type="email"
          className="buyer-form__input"
          value={email}
          onChange={(event) => onChange('email', event.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="buyer-form__field">
        <label htmlFor="buyer-cpf" className="buyer-form__label">CPF</label>
        <input
          id="buyer-cpf"
          name="cpf"
          type="text"
          className="buyer-form__input"
          value={cpf}
          onChange={(event) => onChange('cpf', event.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
    </section>
  );
}

