const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Delete the existing model if it exists to prevent OverwriteModelError
if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
