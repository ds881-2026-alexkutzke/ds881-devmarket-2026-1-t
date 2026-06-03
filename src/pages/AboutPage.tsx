import "./styles/AboutPage.css";

const tecnologias = [
  "React",
  "Vite",
  "TypeScript",
  "React Router DOM",
  "DummyJSON API",
  "ViaCEP API",
  "Open Exchange Rates API",
  "lib qrcode",
];

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
            <li className="pagina-sobre__item-tecnologia" key={tecnologia}>
              {tecnologia}
            </li>
          ))}
        </ul>
      </section>
       className="pagina-sobre__secao">
        <h2>Contato</h2>
        <p>
          E-mail para contato: devmarket.ufpr@gmail.com
        </p>
      </section>

            </section>

      <section className="pagina-sobre__secao">
        <h2>Contato</h2>
        <p>
          E-mail para contato: devmarket.ufpr@gmail.com
        </p>
      </section>

      <section className="pagina-sobre__secao">
        <h2>Créditos</h2>
        <p>
          Projeto desenvolvido colaborativamente pelos alunos da disciplina
          DS881 - DevOps da Universidade Federal do Paraná (UFPR).
        </p>

        <ul className="pagina-sobre__lista-tecnologias">
          <li>Gabriela Harres</li>
          <li>Equipe DevMarket</li>
        </ul>
      </section>

    </div>
  );
}