const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Damage = require('../models/Damage');

// Damage entry and auto-adjust selling price
router.post('/', async (req, res) => {
  try {
    const { productId, damagedQuantity, autoAdjust } = req.body;
    if (!productId || !damagedQuantity) {
      return res.status(400).json({ error: 'Missing required fields', details: { productId, damagedQuantity, autoAdjust } });
    }
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found', details: { productId } });
    }
    if (product.quantity < damagedQuantity) {
      return res.status(400).json({ error: 'Insufficient quantity in stock', details: { available: product.quantity, requested: damagedQuantity } });
    }
    // Decrease stock count
    product.quantity -= damagedQuantity;
    let adjustedSellingPrice = product.sellingPrice;
    if (autoAdjust) {
      // Calculate total loss from damaged products
      const loss = damagedQuantity * product.buyingPrice;
      const remainingQuantity = product.quantity;
      if (remainingQuantity > 0) {
        // Distribute loss to remaining products
        adjustedSellingPrice += loss / remainingQuantity;
        product.sellingPrice = Math.ceil(adjustedSellingPrice);
      }
    } else {
      // Always round up sellingPrice to whole number even if not auto-adjusted
      product.sellingPrice = Math.ceil(product.sellingPrice);
    }
    // Always round up defaultSellingPrice to whole number before saving
    product.defaultSellingPrice = Math.ceil(product.defaultSellingPrice);
    // Ensure defaultSellingPrice is set to a valid number
    if (typeof product.defaultSellingPrice !== 'number' || isNaN(product.defaultSellingPrice) || product.defaultSellingPrice <= 0) {
      let newDefaultSellingPrice = 1;
      if (typeof product.sellingPrice === 'number' && product.sellingPrice > 0) {
        newDefaultSellingPrice = product.sellingPrice;
      } else if (typeof product.buyingPrice === 'number' && product.buyingPrice > 0) {
        newDefaultSellingPrice = product.buyingPrice;
      }
      product.set('defaultSellingPrice', newDefaultSellingPrice);
    }
    await product.save();
    // Save damage entry
    const damageEntry = new Damage({
      productId,
      productName: product.name,
      damagedQuantity,
      autoAdjust
    });
    await damageEntry.save();
    res.json({ success: true, product, damageEntry });
  } catch (err) {
    console.error('Error in /api/damage:', err);
    res.status(500).json({ error: err.message, stack: err.stack, requestBody: req.body });
  }
});

// Get all damage entries
router.get('/', async (req, res) => {
  try {
    const damages = await Damage.find().sort({ createdAt: -1 });
    res.json(damages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
