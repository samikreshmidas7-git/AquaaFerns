const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Setup MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI?.trim() || 'mongodb://localhost:27017/aquaaferns';
console.log('MongoDB URI:', MONGODB_URI); // For debugging

// Define User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  restrictions: [String]
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create User model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  mongoose.connect(MONGODB_URI, options)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Initial connection attempt
connectWithRetry();

// Create Express app
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://aquaaferns-frontend.onrender.com', 'http://localhost:3000'];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Auth middleware
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  try {
    // Check for token in Authorization header or query parameter
    const token = 
      req.header('Authorization')?.replace('Bearer ', '') || 
      req.query.token ||
      req.cookies?.token;

    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      console.error('JWT Verification failed:', jwtError);
      throw new Error('Invalid token');
    }
  } catch (error) {
    // Allow access to public routes even without authentication
    if (req.path.startsWith('/api/products') && req.method === 'GET') {
      return next();
    }
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Auth routes
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        restrictions: user.restrictions || []
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.use('/api/auth', authRouter);

// Import routes
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const damageRoutes = require('./routes/damage');
const customerPointsRoutes = require('./routes/customerPoints');
const customerRoutes = require('./routes/customers');

// Configure routes
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/damage', damageRoutes);
app.use('/api/customer-points', customerPointsRoutes);
app.use('/api/customers', customerRoutes);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// File upload endpoint
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
