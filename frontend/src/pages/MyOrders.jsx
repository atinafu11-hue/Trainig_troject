import { useEffect, useState } from 'react';
import API, { IMAGE_URL } from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="container">Loading...</p>;
  if (orders.length === 0) return <p className="container">No orders yet.</p>;

  return (
    <div className="container">
      <h1>My Orders</h1>
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <div className="order-header">
            <span>Order #{o._id.slice(-8)}</span>
            <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
          </div>
          <p>Date: {new Date(o.createdAt).toLocaleString()}</p>
          <p>Total: ${o.totalAmount.toFixed(2)}</p>
          <p>Address: {o.deliveryAddress}</p>
          {o.orderInstructions && <p>Instructions: {o.orderInstructions}</p>}
          {o.deliveryInstructions && (
            <p>Delivery: {o.deliveryInstructions}</p>
          )}
          <div className="order-items">
            {o.items.map((it, i) => (
              <div key={i} className="order-item">
                <img
                  src={`${IMAGE_URL}${it.image}`}
                  alt={it.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/60')}
                />
                <span>{it.name}</span>
                <span>x{it.quantity}</span>
                <span>${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}