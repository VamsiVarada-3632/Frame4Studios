/**
 * add-admin.js
 * Run: node src/add-admin.js
 * Creates a new admin account in MongoDB.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';

dotenv.config();

const NEW_ADMIN = {
  username: 'adminf4s',
  email: 'adminf4s@frame4studios.com',
  password: 'passwordf4s',
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Remove existing account with same username/email to avoid conflicts
  await Admin.deleteMany({
    $or: [{ username: NEW_ADMIN.username }, { email: NEW_ADMIN.email }],
  });

  const admin = new Admin(NEW_ADMIN);
  await admin.save();

  console.log(`✅ Admin created:
  Username : ${NEW_ADMIN.username}
  Email    : ${NEW_ADMIN.email}
  Password : ${NEW_ADMIN.password}
`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
