import './styles/ProductRating.css';

type ProductRatingProps = {
  rating: number;
};

const ProductRating = ({ rating }: ProductRatingProps) => {
  const clamped = Math.max(0, Math.min(5, rating));
  const filled = Math.round(clamped);

  return (
    <div className="product-rating" aria-label={`Avaliação: ${clamped.toFixed(1)} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`product-rating__star ${i < filled ? 'product-rating__star--filled' : 'product-rating__star--empty'}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="product-rating__value">{clamped.toFixed(1)}</span>
    </div>
  );
};

export default ProductRating;
