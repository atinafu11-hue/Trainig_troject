import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { IMAGE_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [p, r] = await Promise.all([
      API.get(`/products/${id}`),
      API.get(`/reviews/${id}`),
    ]);
    setProduct(p.data);
    setReviews(r.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    try {
      await addToCart(product._id, quantity);
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${id}`, { rating, comment });
      setComment('');
      setRating(5);
      setMsg('Review added!');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  if (!product) return <p className="container">Loading...</p>;

  return (
    <div className="container product-details">
      <img
        src={`${IMAGE_URL}${product.image}`}
        alt={product.name}
        onError={(e) => (e.target.src = 'https://via.placeholder.com/400')}
      />
      <div>
        <h1>{product.name}</h1>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p className="rating">
          ⭐ {product.averageRating || 0} ({product.numReviews || 0} reviews)
        </p>
        <p>Stock: {product.stockQuantity}</p>

        <div className="add-to-cart">
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            onClick={handleAdd}
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        <h2>Reviews</h2>
        {user && (
          <form className="review-form" onSubmit={submitReview}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} ⭐</option>
              ))}
            </select>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
            {msg && <p>{msg}</p>}
          </form>
        )}
        <div className="reviews-list">
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="review-item">
              <strong>{r.user?.fullName || 'Anonymous'}</strong> — {r.rating} ⭐
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}