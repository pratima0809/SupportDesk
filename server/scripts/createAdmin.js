require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'Aisha2006@gmail.com';
const ADMIN_PWD = '20092006';
const ADMIN_NAME = 'Aisha Admin';
const categories = ['Technical', 'Network', 'Account', 'Academic', 'Other'];

async function createAdmin() {
  try {
    await connectDB();
    let user = await User.findOne({ email: ADMIN_EMAIL });

    if (user) {
      console.log('Admin user already exists — updating role/password if needed');
      // Ensure role is admin and update password if different
      const passwordMatches = await bcrypt.compare(ADMIN_PWD, user.password || '');
      if (!passwordMatches) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(ADMIN_PWD, salt);
      }
      user.role = 'admin';
      user.name = ADMIN_NAME;
      await user.save();
      console.log('Admin user updated:', user.email);
      process.exit(0);
    }

    // Create new admin user
    const newUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PWD,
      role: 'admin',
    });

    // Seed staff pools with 10 staff each if not present
    const StaffPool = require('../models/StaffPool');
    for (const cat of categories) {
      const existing = await StaffPool.findOne({ category: cat });
      if (!existing) {
        await StaffPool.create({ category: cat, count: 10 });
        console.log('Seeded staff pool for', cat);
      }
    }

    console.log('Admin user created:', newUser.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create/update admin user:', err);
    process.exit(1);
  }
}

createAdmin();
