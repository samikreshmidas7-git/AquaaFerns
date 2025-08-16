const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/aquaaferns', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const staffUsers = [
  {
    name: 'Indranil',
    email: 'indranil@aquaaferns.com',
    password: 'StrongPassword123!',
    role: 'staff',
    restrictions: ['dashboard']
  },
  {
    name: 'Staff Member 1',
    email: 'staff1@aquaaferns.com',
    password: 'Staff1Pass123!',
    role: 'staff',
    restrictions: []
  },
  {
    name: 'Staff Member 2',
    email: 'staff2@aquaaferns.com',
    password: 'Staff2Pass123!',
    role: 'staff',
    restrictions: []
  }
];

async function createStaffUsers() {
  try {
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      restrictions: [String]
    });

    userSchema.pre('save', async function(next) {
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    });

    const User = mongoose.model('User', userSchema);

    for (const staffData of staffUsers) {
      const existingUser = await User.findOne({ email: staffData.email });
      if (existingUser) {
        console.log(`User ${staffData.email} already exists`);
        continue;
      }

      const user = new User(staffData);
      await user.save();
      console.log(`Created user: ${staffData.email}`);
    }

    console.log('All staff users created successfully');
  } catch (error) {
    console.error('Error creating staff users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createStaffUsers();
