require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

(async () => {
  await connectDB();

  // Admin user
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    await User.create({
      fullName: 'Store Owner',
      username: 'admin',
      email: 'admin@shophub.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created (username: admin, password: admin123)');
  }

  // Sample products (image files are not required for seeding)
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      { name: 'Wireless Headphones', description: 'Noise cancelling over-ear headphones.', price: 199, category: 'Electronics', stockQuantity: 25, image: '/uploads/sample.jpg' },
      { name: 'Cotton T-Shirt', description: 'Premium 100% cotton, unisex.', price: 25, category: 'Clothing', stockQuantity: 100, image: '/uploads/sample.jpg' },
      { name: 'Clean Code (Book)', description: 'A handbook of agile software craftsmanship.', price: 45, category: 'Books', stockQuantity: 40, image: '/uploads/sample.jpg' },
      { name: 'Ceramic Coffee Mug', description: 'Handmade 350ml mug.', price: 15, category: 'Home', stockQuantity: 60, image: '/uploads/sample.jpg' },
      { name: 'Yoga Mat', description: 'Non-slip 6mm mat.', price: 35, category: 'Sports', stockQuantity: 30, image: '/uploads/sample.jpg' },
    ]);
    console.log('✅ Sample products inserted');
  }

  await mongoose.connection.close();
  process.exit(0);
})();