const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Create a new sale
router.post('/', async (req, res) => {
  try {
    const { customerName, saleDate, products } = req.body;
    
    // Calculate total amount and profit for each product
    let totalAmount = 0;
    let totalProfit = 0;
    
    // Add profit calculation for each product
    const productsWithProfit = products.map(item => {
      const profit = (item.actualSellingPrice - item.buyingPrice) * item.quantity;
      totalAmount += item.actualSellingPrice * item.quantity;
      totalProfit += profit;
      
      return {
        ...item,
        profit
      };
    });
    
    // Create the sale object
    const sale = new Sale({
      customerName,
      saleDate: new Date(saleDate),
      products: productsWithProfit,
      totalAmount,
      totalProfit
    });

    // Update product quantities
    for (const item of products) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productName}` });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient quantity for product: ${item.productName}. Available: ${product.quantity}, Requested: ${item.quantity}` 
        });
      }
      
      await Product.updateOne(
        { productId: item.productId },
        { $inc: { quantity: -item.quantity } }
      );
    }
    
    // Save the sale
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    console.error('Sale creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all sales
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales by date range
router.get('/byDate', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    const sales = await Sale.find(query);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales by specific day in IST
router.get('/byDay', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const istDate = new Date(date);
    
    // Set time to start of day in IST (00:00:00)
    istDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(istDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
      saleDate: {
        $gte: istDate,
        $lt: nextDay
      }
    };
    
    const sales = await Sale.find(query);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single sale
router.get('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('productId');
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a sale
router.put('/:id', auth, async (req, res) => {
  try {
    const oldSale = await Sale.findById(req.params.id);
    if (!oldSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Restore old quantity
    const product = await Product.findOne({ productId: oldSale.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Validate and deduct new quantity
    if ((product.quantity + oldSale.quantity) < req.body.quantity) {
      return res.status(400).json({ error: 'Insufficient product quantity' });
    }
    
    // First restore the old quantity, then deduct the new quantity
    await Product.updateOne(
      { productId: oldSale.productId },
      { 
        $inc: { 
          quantity: oldSale.quantity - req.body.quantity 
        } 
      }
    );

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('productId');
    
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sale
router.delete('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Restore product quantity
    const product = await Product.findOne({ productId: sale.productId });
    if (product) {
      await Product.updateOne(
        { productId: sale.productId },
        { $inc: { quantity: sale.quantity } }
      );
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
