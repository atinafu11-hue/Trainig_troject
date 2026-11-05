const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay order from current cart
const createRazorpayOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length)
      return res.status(400).json({ message: 'Cart is empty' });

    let amount = 0;
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity)
        return res.status(400).json({ message: `Insufficient stock: ${item.product.name}` });
      amount += item.product.price * item.quantity;
    }

    const rOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({ ...rOrder, amountInRupees: amount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Verify signature → save order → decrement stock → clear cart
const verifyAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderInstructions,
      deliveryInstructions,
      deliveryAddress,
    } = req.body;

    // Cryptographic signature verification (paper §V.F)
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: 'Invalid payment signature' });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length)
      return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity)
        return res.status(400).json({ message: `Insufficient stock: ${item.product.name}` });

      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      });
    }

    // Decrement stock (Tech Stack spec §3.D)
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      orderInstructions,
      deliveryInstructions,
      deliveryAddress,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: 'Paid',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fallback: COD/simulated payment (no Razorpay required for demo)
const createSimulatedOrder = async (req, res) => {
  try {
    const { orderInstructions, deliveryInstructions, deliveryAddress } = req.body;
    if (!deliveryAddress)
      return res.status(400).json({ message: 'Delivery address required' });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length)
      return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity)
        return res.status(400).json({ message: `Insufficient stock: ${item.product.name}` });

      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      });
    }

    for (const item of orderItems)
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity },
      });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      orderInstructions,
      deliveryInstructions,
      deliveryAddress,
      paymentStatus: 'Paid',
      paymentId: `SIM-${Date.now()}`,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRazorpayOrder, verifyAndCreateOrder, createSimulatedOrder };