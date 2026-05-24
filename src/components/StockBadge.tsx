import React from 'react';
import './styles/StockBadge.css';

type StockBadgeProps = {
  stock: number;
};

const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  const inStock = stock > 0;

  return (
    <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
      {inStock ? 'Em estoque' : 'Esgotado'}
    </span>
  );
};

export default StockBadge;
