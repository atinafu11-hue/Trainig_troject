import { useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0)
    return <p className="container">Your cart is empty.</p>;

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      <div className="cart-list">
        {cart.items.map((item) => (
          <div key={item.product._id} className="cart-item">
            <img
              src={`${IMAGE_URL}${item.product.image}`}
              alt={item.product.name}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
            />
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p>${item.product.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.product._id, Number(e.target.value))
              }
            />
            <button onClick={() => removeItem(item.product._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ${total.toFixed(2)}</h2>
        <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
}