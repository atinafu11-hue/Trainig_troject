const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    orderInstructions: { type: String, default: '' },
    deliveryInstructions: { type: String, default: '' },
    deliveryAddress: { type: String, required: true },
    paymentId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);