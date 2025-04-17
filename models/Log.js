const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { type: String, enum: ['add', 'delete'], required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productSnapshot: {
    name: String,
    price: Number,
    quantity: Number,
    totalAmount: Number
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

// Custom logic to set the expiration date
logSchema.pre('save', function(next) {
  const expirationTime = this.action === 'add' ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 1; // 7 days for add, 3 days for delete
  this.timestamp = new Date(Date.now() + expirationTime * 1000); // Set the expiration timestamp
  next();
});

// TTL index that uses the timestamp
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Log', logSchema);
