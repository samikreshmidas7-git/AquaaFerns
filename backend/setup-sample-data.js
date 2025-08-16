const mongoose = require('mongoose');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const User = require('./models/User');

async function setupSampleData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/aquaaferns', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // First find the staff user to associate with sales
    const staffUser = await User.findOne({ email: 'samik10@aquaaferns.com' });
    if (!staffUser) {
      console.error('Staff user not found. Please run create-staff.js first');
      process.exit(1);
    }

    // Add sample products
    const products = [
      {
        name: 'Japanese Maple',
        description: 'Beautiful ornamental tree with red leaves',
        price: 1999.99,
        quantity: 50,
        category: 'Trees'
      },
      {
        name: 'Boston Fern',
        description: 'Popular indoor hanging plant',
        price: 299.99,
        quantity: 100,
        category: 'Indoor Plants'
      },
      {
        name: 'Peace Lily',
        description: 'Air-purifying indoor plant',
        price: 399.99,
        quantity: 75,
        category: 'Indoor Plants'
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const savedProducts = await Product.insertMany(products);
    console.log('Added sample products');

    // Add sample sales
    const sales = [
      {
        product: savedProducts[0]._id,
        quantity: 2,
        totalAmount: 3999.98,
        customer: {
          name: 'John Doe',
          phone: '1234567890',
          email: 'john@example.com'
        },
        soldBy: staffUser._id,
        saleDate: new Date('2025-08-09')
      },
      {
        product: savedProducts[1]._id,
        quantity: 5,
        totalAmount: 1499.95,
        customer: {
          name: 'Jane Smith',
          phone: '9876543210',
          email: 'jane@example.com'
        },
        soldBy: staffUser._id,
        saleDate: new Date('2025-08-10')
      },
      {
        product: savedProducts[2]._id,
        quantity: 3,
        totalAmount: 1199.97,
        customer: {
          name: 'Robert Brown',
          phone: '5555555555',
          email: 'robert@example.com'
        },
        soldBy: staffUser._id,
        saleDate: new Date('2025-08-10')
      }
    ];

    // Clear existing sales
    await Sale.deleteMany({});
    console.log('Cleared existing sales');

    // Insert new sales
    await Sale.insertMany(sales);
    console.log('Added sample sales');

    console.log('Sample data setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupSampleData();
