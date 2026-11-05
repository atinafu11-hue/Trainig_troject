import { useEffect, useState } from 'react';
import API, { IMAGE_URL } from '../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stockQuantity: '',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const loadProducts = async () => {
    const { data } = await API.get('/products?limit=100');
    setProducts(data.products);
  };
  const loadOrders = async () => {
    const { data } = await API.get('/orders');
    setOrders(data);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);

    try {
      if (editId) {
        await API.put(`/products/${editId}`, fd);
      } else {
        await API.post('/products', fd);
      }
      setForm(emptyForm);
      setImage(null);
      setEditId(null);
      loadProducts();
      alert('Saved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const editProduct = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stockQuantity: p.stockQuantity,
    });
    setEditId(p._id);
    setTab('products');
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Manage Products
        </button>
        <button
          className={tab === 'orders' ? 'active' : ''}
          onClick={() => setTab('orders')}
        >
          All Orders
        </button>
      </div>

      {tab === 'products' && (
        <>
          <form className="admin-form" onSubmit={submitProduct}>
            <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {['Electronics', 'Clothing', 'Books', 'Home', 'Sports'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock quantity"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm({ ...form, stockQuantity: e.target.value })
              }
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                  setImage(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="admin-products">
            {products.map((p) => (
              <div key={p._id} className="admin-product-row">
                <img
                  src={`${IMAGE_URL}${p.image}`}
                  alt={p.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/60')}
                />
                <span>{p.name}</span>
                <span>${p.price}</span>
                <span>Stock: {p.stockQuantity}</span>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className="admin-orders">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} className="order-card">
              <div className="order-header">
                <span>Order #{o._id.slice(-8)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p>Customer: {o.user?.fullName} ({o.user?.email})</p>
              <p>Total: ${o.totalAmount.toFixed(2)}</p>
              <p>Address: {o.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}