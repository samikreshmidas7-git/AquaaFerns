const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createRouter() {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Set token in cookie for enhanced security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send response without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    console.log('Login successful for user:', email);
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Create initial staff account route
router.post('/create-initial-staff', async (req, res) => {
  try {
    // Check if any staff user exists
    const existingStaff = await User.findOne({ role: 'staff' });
    if (existingStaff) {
      return res.status(400).json({ error: 'Staff account already exists' });
    }

    const { email, password, name } = req.body;
    const user = new User({
      email,
      password,
      name,
      role: 'staff'
    });

    await user.save();
    console.log('Staff account created:', email);
    res.status(201).json({ message: 'Staff account created successfully' });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Please authenticate' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Please authenticate' });
  }
});

  return router;
}

module.exports = createRouter();
