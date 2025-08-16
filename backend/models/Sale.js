const mongoose = require('mongoose');

const saleProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  actualSellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  defaultSellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  buyingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    trim: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  products: [saleProductSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalProfit: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Calculate profit
saleSchema.virtual('profit').get(function() {
  return this.products.reduce((total, item) => {
    return total + (item.actualSellingPrice - item.buyingPrice) * item.quantity;
  }, 0);
});

// Ensure virtuals are included in JSON output
saleSchema.set('toJSON', { virtuals: true });
saleSchema.set('toObject', { virtuals: true });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
