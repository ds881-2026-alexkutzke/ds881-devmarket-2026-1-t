import './styles/StockBadge.css';

type StockBadgeProps = {
  stock: number;
};

export default function StockBadge({
  stock,
}: StockBadgeProps) {
  const inStock = stock > 0;

  return (
    <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
      {inStock ? 'Em estoque' : 'Esgotado'}
    </span>
  );
};

