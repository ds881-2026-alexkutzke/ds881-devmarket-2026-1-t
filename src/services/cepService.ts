//esperando pr da issue #50 ser aprovado para usar /types/checkout.types.ts
export interface AddressInfo {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

type ViaCepResponse = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

export const fetchAddressByCep = async (cep: string): Promise<AddressInfo> => {
  const normalizedCep = normalizeCep(cep);

  if (normalizedCep.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`);

  if (!response.ok) {
    throw new Error('Falha ao buscar CEP');
  }

  const data = await response.json() as ViaCepResponse;

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    cep: normalizeCep(data.cep),
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  };
};
