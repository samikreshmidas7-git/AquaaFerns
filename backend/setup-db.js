const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/aquaaferns');
    console.log('Connected to MongoDB');

    // Define the schema
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      restrictions: [String]
    });

    // Add password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    };

    // Hash password before saving
    userSchema.pre('save', async function(next) {
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    });

    // Delete any existing model
    delete mongoose.models.User;
    
    // Create the model
    const User = mongoose.model('User', userSchema);

    // Clear existing users
    await mongoose.connection.collection('users').deleteMany({});
    console.log('Cleaned up existing users');

    // Create test user
    const user = new User({
      email: 'samik10@aquaaferns.com',
      password: 'kblw8955',
      name: 'Samik',
      role: 'staff'
    });

    // Save the user
    const savedUser = await user.save();
    console.log('Created test user:', {
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      hasPassword: !!savedUser.password
    });

    // Verify password comparison works
    const isMatch = await savedUser.comparePassword('kblw8955');
    console.log('Password verification works:', isMatch);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase();
