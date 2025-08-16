const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
        default: 0,
        min: 0
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
