const mongoose = require('mongoose');

const customerPointsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const CustomerPoints = mongoose.model('CustomerPoints', customerPointsSchema);

module.exports = CustomerPoints;
