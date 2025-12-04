require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const uri = process.env.MONGO_CONNECTION_STRING;
  if (!uri) {
    console.error('MONGO_CONNECTION_STRING is not set in environment');
    process.exit(1);
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'admin@aidexpress.com';
  const password = 'admin123';
  const firstName = 'Admin';
  const lastName = 'User';
  const phone = '+2348000000000';

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone,
        role: 'admin',
      });
      console.log('Created admin user:', email);
    } else {
      // Update role to admin and reset password
      user.role = 'admin';
      user.password = password; // will be hashed by pre('save')
      if (!user.firstName) user.firstName = firstName;
      if (!user.lastName) user.lastName = lastName;
      if (!user.phone) user.phone = phone;
      await user.save();
      console.log('Updated existing user to admin:', email);
    }
  } catch (err) {
    console.error('Failed to seed admin user:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
