import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { RAZORPAY_KEY_ID } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    deliveryAddress: '',
    orderInstructions: '',
    deliveryInstructions: '',
  });
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.deliveryAddress) return alert('Delivery address is required');
    if (cart.items.length === 0) return alert('Cart is empty');
    setLoading(true);

    try {
      // Try Razorpay flow if key configured
      if (RAZORPAY_KEY_ID && RAZORPAY_KEY_ID.startsWith('rzp_')) {
        const scriptOk = await loadRazorpayScript();
        if (!scriptOk) throw new Error('Razorpay SDK failed to load');

        const { data: rzpOrder } = await API.post('/payments/razorpay/create');

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'ShopHub',
          description: 'Order Payment',
          order_id: rzpOrder.id,
          prefill: {
            name: user.fullName,
            email: user.email,
          },
          theme: { color: '#0077ff' },
          handler: async (response) => {
            try {
              await API.post('/payments/razorpay/verify', {
                ...response,
                ...form,
              });
              await fetchCart();
              alert('Payment successful! 🎉');
              navigate('/my-orders');
            } catch (err) {
              alert(err.response?.data?.message || 'Verification failed');
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => alert('Payment failed'));
        rzp.open();
      } else {
        // Fallback: simulated payment
        await API.post('/payments/simulate', form);
        await fetchCart();
        alert('Order placed successfully! (simulated payment)');
        navigate('/my-orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-form">
      <h1>Checkout</h1>
      <h3>Total: ${total.toFixed(2)}</h3>
      <form onSubmit={handlePay}>
        <textarea
          placeholder="Delivery Address *"
          value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          required
        />
        <textarea
          placeholder="Order instructions (e.g. Gift wrap, Fragile)"
          value={form.orderInstructions}
          onChange={(e) => setForm({ ...form, orderInstructions: e.target.value })}
        />
        <textarea
          placeholder="Delivery instructions (e.g. Call on arrival)"
          value={form.deliveryInstructions}
          onChange={(e) =>
            setForm({ ...form, deliveryInstructions: e.target.value })
          }
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </form>
    </div>
  );
}