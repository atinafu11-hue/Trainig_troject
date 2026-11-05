import { Link } from 'react-router-dom';
import { IMAGE_URL } from '../services/api';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img
          src={`${IMAGE_URL}${product.image}`}
          alt={product.name}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
        />
      </Link>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          ⭐ {product.averageRating || 0} ({product.numReviews || 0})
        </p>
        <p className={product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}>
          {product.stockQuantity > 0
            ? `In Stock (${product.stockQuantity})`
            : 'Out of Stock'}
        </p>
      </div>
    </div>
  );
}