const express = require('express');
const router = express.Router();
const CustomerPoints = require('../models/CustomerPoints');
const { auth } = require('../middleware/auth');

// Get all customer points
router.get('/', (req, res) => {
  CustomerPoints.find().sort({ points: -1 })
    .then(customerPoints => res.json(customerPoints))
    .catch(error => {
      console.error('Error fetching customer points:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// Get customer points by phone
router.get('/:phone', (req, res) => {
  CustomerPoints.findOne({ phone: req.params.phone })
    .then(customerPoints => {
      if (!customerPoints) {
        return res.status(404).json({ message: 'Customer points not found' });
      }
      res.json(customerPoints);
    })
    .catch(error => {
      console.error('Error fetching customer points:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// Create or update customer points
router.post('/', auth, async function(req, res) {
  try {
    const { name, phone, points } = req.body;
    
    let customerPoints = await CustomerPoints.findOne({ phone });
    if (customerPoints) {
      // Update existing points
      customerPoints.points = points;
      customerPoints = await customerPoints.save();
    } else {
      // Create new customer points
      customerPoints = new CustomerPoints({
        name,
        phone,
        points
      });
      customerPoints = await customerPoints.save();
    }
    
    res.json(customerPoints);
  } catch (error) {
    console.error('Error updating customer points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer points
router.put('/:phone', auth, function(req, res) {
  const { points, name } = req.body;
  const update = { points };
  if (name) update.name = name;
  
  CustomerPoints.findOneAndUpdate(
    { phone: req.params.phone },
    update,
    { new: true }
  )
    .then(customerPoints => {
      if (!customerPoints) {
        return res.status(404).json({ message: 'Customer points not found' });
      }
      res.json(customerPoints);
    })
    .catch(error => {
      console.error('Error updating customer points:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// Delete customer points
router.delete('/:phone', auth, function(req, res) {
  CustomerPoints.findOneAndDelete({ phone: req.params.phone })
    .then(customerPoints => {
      if (!customerPoints) {
        return res.status(404).json({ message: 'Customer points not found' });
      }
      res.json({ message: 'Customer points deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting customer points:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
