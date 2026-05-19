import './styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>DevMarket © {currentYear}</p>
      <p>Projeto colaborativo dos alunos da disciplina de Tópicos Especiais em Tecnologias Emergentes - DS881 - Tarde - UFPR</p>
    </footer>
  );
};

export default Footer;