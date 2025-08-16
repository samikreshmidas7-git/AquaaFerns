const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  defaultSellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  buyingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving and round prices
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof this.sellingPrice === 'number') {
    this.sellingPrice = Math.ceil(this.sellingPrice);
  }
  if (typeof this.defaultSellingPrice === 'number') {
    this.defaultSellingPrice = Math.ceil(this.defaultSellingPrice);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
