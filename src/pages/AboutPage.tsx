import { Link } from "react-router-dom";
import "./styles/AboutPage.css";

type Tecnologia = {
  name: string;
};

type Api = {
  name: string;
  url: string;
  description: string;
};

type Funcionalidade = {
  icon: string;
  label: string;
};

type Contributor = {
  name: string;
  role: string;
  github: string;
  badge?: string;
};

const tecnologias: Tecnologia[] = [
  { name: "React" },
  { name: "Vite" },
  { name: "TypeScript" },
  { name: "React Router DOM" },
  { name: "lib qrcode" },
];

const apis: Api[] = [
  {
    name: "DummyJSON",
    url: "https://dummyjson.com/products",
    description:
      "Fornece o catálogo de produtos com título, preço, imagens, estoque e avaliações.",
  },
  {
    name: "Open Exchange Rates",
    url: "https://open.er-api.com/v6/latest/USD",
    description:
      "Converte os preços de USD para BRL em tempo real, exibindo os valores na moeda local.",
  },
  {
    name: "ViaCEP",
    url: "https://viacep.com.br",
    description:
      "Preenche automaticamente o endereço de entrega a partir do CEP digitado no checkout.",
  },
];

const funcionalidades: Funcionalidade[] = [
  { icon: "", label: "Catálogo de produtos" },
  { icon: "", label: "Busca e filtro por categoria" },
  { icon: "", label: "Carrinho de compras" },
  { icon: "", label: "Checkout com endereço" },
  { icon: "", label: "Autocompletar por CEP" },
  { icon: "", label: "Conversão USD → BRL" },
  { icon: "", label: "Pagamento via PIX" },
  { icon: "", label: "QR Code dinâmico" },
];

const stats = [
  { value: "29", label: "Contribuidores" },
  { value: "3", label: "APIs integradas" },
];

const contributors: Contributor[] = [
  {
    name: "Alexander Kutzke",
    role: "Professor / Orientador",
    github: "https://github.com/alexkutzke",
  },
  {
    name: "Ana Clara Martins Batista",
    role: "Equipe DevMarket",
    github: "https://github.com/anambclara",
  },
  {
    name: "Bruna de Lima",
    role: "Equipe DevMarket",
    github: "https://github.com/ibrunny",
  },
  {
    name: "Bruno Brugnerotto",
    role: "Equipe DevMarket",
    github: "https://github.com/BrunoBrug",
  },
  {
    name: "Bruno Pedron Rupaner",
    role: "Equipe DevMarket",
    github: "https://github.com/bruno-pedron",
  },
  {
    name: "Clarissa Morita",
    role: "Equipe DevMarket",
    github: "https://github.com/cissamil",
  },
  {
    name: "Daniela Tamy",
    role: "Equipe DevMarket",
    github: "https://github.com/DanielaTamy",
  },
  {
    name: "Dyego Dasko",
    role: "Equipe DevMarket",
    github: "https://github.com/Dasko7b",
  },
  {
    name: "Felyppe Marcelo da Silva",
    role: "Equipe DevMarket",
    github: "https://github.com/felyppe1201",
  },
  {
    name: "Gabriela Morais Gandine",
    role: "Equipe DevMarket",
    github: "https://github.com/gabi-gandine",
  },
  {
    name: "Henrique Meneses",
    role: "Equipe DevMarket",
    github: "https://github.com/z3nrique",
  },
  {
    name: "Jamily Notario",
    role: "Equipe DevMarket",
    github: "https://github.com/jamily-not",
    badge: "Product Owner",
  },
  {
    name: "Johnny Labes",
    role: "Equipe DevMarket",
    github: "https://github.com/jlabes",
    badge: "Product Owner",
  },
  {
    name: "Juliano Vidal Silva",
    role: "Equipe DevMarket",
    github: "https://github.com/julianoitado",
  },
  {
    name: "Leonardo Alberto",
    role: "Equipe DevMarket",
    github: "https://github.com/leonardoalberto733",
  },
  {
    name: "Leticia Sanches",
    role: "Equipe DevMarket",
    github: "https://github.com/Lsats",
  },
  {
    name: "Lucas Garzuze Cordeiro",
    role: "Equipe DevMarket",
    github: "https://github.com/garzuze",
    badge: "Tech Lead",
  },
  {
    name: "Maria Fernanda Zandona Casagrande",
    role: "Equipe DevMarket",
    github: "https://github.com/fe-fe",
  },
  {
    name: "Matheus José Chaves de Lima",
    role: "Equipe DevMarket",
    github: "https://github.com/mateoclima",
    badge: "Scrum Master",
  },
  {
    name: "Paulo Roberto Gomes Barroso Schiochet",
    role: "Equipe DevMarket",
    github: "https://github.com/pauloschiochetufpr",
  },
  {
    name: "Pedro Eduardo Dall' Agnol",
    role: "Equipe DevMarket",
    github: "https://github.com/NeroPRDO",
  },
  {
    name: "Pedro Novak Wosch",
    role: "Equipe DevMarket",
    github: "https://github.com/Kaironst",
  },
  {
    name: "Peterson Fontinhas",
    role: "Equipe DevMarket",
    github: "https://github.com/PAFONTINHAS",
    badge: "Tech Lead",
  },
  {
    name: "Roberto Rigo",
    role: "Equipe DevMarket",
    github: "https://github.com/xariote",
  },
  {
    name: "Sabrina Dorigoni Pelentir",
    role: "Equipe DevMarket",
    github: "https://github.com/sabrina-dp",
    badge: "Scrum Master",
  },
  {
    name: "Thiago de Lima de Assis Cordeiro",
    role: "Equipe DevMarket",
    github: "https://github.com/Thiago-cordeiro",
  },
  {
    name: "Thiago Tanaka Peczek",
    role: "Equipe DevMarket",
    github: "https://github.com/Thiago-Peczek",
    badge: "Tech Lead",
  },
];

function githubAvatar(profileUrl: string): string {
  const username = profileUrl.replace("https://github.com/", "");
  return `https://github.com/${username}.png`;
}

export default function AboutPage() {
  return (
    <div className="pagina-sobre">
      <section className="pagina-sobre__destaque" aria-labelledby="about-title">
        <p className="pagina-sobre__rotulo">Projeto acadêmico</p>
        <h1 id="about-title">Sobre o DevMarket</h1>
        <p className="pagina-sobre__introducao">
          O DevMarket é uma aplicação de e-commerce desenvolvida para simular
          uma loja digital com catálogo de produtos, carrinho de compras,
          checkout, integração com endereço por CEP, conversão de moeda e
          pagamento via PIX com QR Code.
        </p>

        <div className="pagina-sobre__stats" aria-label="Estatísticas do projeto">
          {stats.map((stat) => (
            <div key={stat.label} className="pagina-sobre__stat">
              <span className="pagina-sobre__stat-valor">{stat.value}</span>
              <span className="pagina-sobre__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Funcionalidades</h2>
        <ul className="pagina-sobre__lista-funcionalidades" aria-label="Funcionalidades">
          {funcionalidades.map((f) => (
            <li key={f.label} className="pagina-sobre__item-funcionalidade">
              <span className="pagina-sobre__func-icon" aria-hidden="true">{f.icon}</span>
              {f.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Modelo de negócio</h2>
        <p>
          A proposta do DevMarket é representar um marketplace online em que
          clientes podem consultar produtos, analisar informações de preço e
          estoque, adicionar itens ao carrinho e avançar no fluxo de compra. O
          projeto prioriza uma experiência próxima de um comércio eletrônico
          real, conectando serviços externos para enriquecer a jornada do
          usuário.
        </p>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Contexto acadêmico</h2>
        <p>
          Este projeto foi construído no contexto da Universidade Federal do
          Paraná (UFPR), para a disciplina de DevOps (DS881). A implementação
          reúne práticas de desenvolvimento frontend, consumo de APIs,
          organização de rotas, componentização e validação de qualidade dentro
          de um fluxo colaborativo.
        </p>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Tecnologias utilizadas</h2>
        <ul className="pagina-sobre__lista-tecnologias" aria-label="Tecnologias utilizadas">
          {tecnologias.map((tecnologia) => (
            <li className="pagina-sobre__item-tecnologia" key={tecnologia.name}>
              {tecnologia.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="pagina-sobre__secao">
        <h2>APIs integradas</h2>
        <ul className="pagina-sobre__lista-apis" aria-label="APIs integradas">
          {apis.map((api) => (
            <li key={api.name} className="pagina-sobre__item-api">
              <div className="pagina-sobre__api-cabecalho">
                <a
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pagina-sobre__api-nome"
                >
                  {api.name} ↗
                </a>
              </div>
              <p className="pagina-sobre__api-descricao">{api.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Repositório</h2>
        <p>O código-fonte do projeto está disponível no GitHub.</p>
        <a
          href="https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-t"
          target="_blank"
          rel="noopener noreferrer"
          className="pagina-sobre__btn-repo"
        >
          Ver no GitHub ↗
        </a>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Contato</h2>
        <p>E-mail para contato: devmarket.ufpr@gmail.com</p>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Créditos</h2>
        <p>
          Projeto desenvolvido colaborativamente pelos alunos da disciplina
          DS881 - DevOps da Universidade Federal do Paraná (UFPR).
        </p>

        <ul className="pagina-sobre__lista-contribuidores" aria-label="Contribuidores">
          {contributors.map((contributor) => (
            <li key={contributor.github} className="pagina-sobre__contribuidor">
              <div className="pagina-sobre__contribuidor-esquerda">
                <img
                  src={githubAvatar(contributor.github)}
                  alt={`Avatar de ${contributor.name}`}
                  className="pagina-sobre__avatar"
                  loading="lazy"
                />
                <div className="pagina-sobre__contribuidor-nome-grupo">
                  <a
                    href={contributor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pagina-sobre__contribuidor-link"
                  >
                    {contributor.name}
                  </a>
                  {contributor.badge && (
                    <span className="pagina-sobre__badge">{contributor.badge}</span>
                  )}
                </div>
              </div>
              <span className="pagina-sobre__contribuidor-papel">
                {contributor.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="pagina-sobre__voltar">
        <Link to="/" className="pagina-sobre__btn-voltar">
          ← Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
