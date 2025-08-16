const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');

// Get all customers with optional search
router.get('/', auth, async function(req, res) {
    try {
        let query = {};
        if (req.query.q) {
            const searchRegex = new RegExp(req.query.q, 'i');
            query = {
                $or: [
                    { name: searchRegex },
                    { phone: searchRegex }
                ]
            };
        }
        
        const customers = await Customer.find(query).sort({ name: 1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});

// Create new customer
router.post('/', auth, async function(req, res) {
    try {
        const { name, phone, points } = req.body;
        
        // Check if phone number already exists
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this phone number already exists' });
        }

        const customer = new Customer({
            name,
            phone,
            points: points || 0
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error creating customer', error: error.message });
    }
});

// Update customer
router.put('/:id', auth, async function(req, res) {
    try {
        const { name, phone, points } = req.body;
        const customerId = req.params.id;

        // Check if phone number exists for another customer
        if (phone) {
            const existingCustomer = await Customer.findOne({ 
                phone, 
                _id: { $ne: customerId } 
            });
            if (existingCustomer) {
                return res.status(400).json({ message: 'Phone number already registered to another customer' });
            }
        }

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            { name, phone, points },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating customer', error: error.message });
    }
});

// Delete customer
router.delete('/:id', auth, async function(req, res) {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
});

// Get single customer by ID
router.get('/:id', auth, async function(req, res) {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

// Update customer points
router.patch('/:id/points', auth, async function(req, res) {
    try {
        const { points } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $inc: { points: points } },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating points', error: error.message });
    }
});

module.exports = router;
