const mongoose = require('mongoose');

const damageSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  damagedQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  autoAdjust: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Damage = mongoose.model('Damage', damageSchema);

module.exports = Damage;
