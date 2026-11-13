const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
connectDB();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const app = express();

const allowedOrigins = [
  "https://trainig-troject.vercel.app/",
  process.env.CLIENT_URL
].filter(Boolean);;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (Technical Paper §V.C)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

app.use((_, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));