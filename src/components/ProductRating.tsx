import './styles/ProductRating.css';

type ProductRatingProps = {
  rating: number;
};

const ProductRating = ({ rating }: ProductRatingProps) => {
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const decimal = clamped - fullStars;
  const hasHalf = decimal >= 0.25 && decimal < 0.75;
  const filled = hasHalf ? fullStars : Math.round(clamped);

  const getStarClass = (i: number) => {
    if (i < fullStars) return 'product-rating__star--filled';
    if (i === fullStars && hasHalf) return 'product-rating__star--half';
    if (i < filled) return 'product-rating__star--filled';
    return 'product-rating__star--empty';
  };

  return (
    <div className="product-rating" aria-label={`Avaliação: ${clamped.toFixed(1)} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`product-rating__star ${getStarClass(i)}`}
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
