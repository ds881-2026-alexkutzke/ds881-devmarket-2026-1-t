import './styles/LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="spinner-container" role="status">
      <div className="loading-spinner"></div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}