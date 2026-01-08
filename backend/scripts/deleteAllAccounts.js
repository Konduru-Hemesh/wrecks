/**
 * Script to delete all user accounts and their associated data
 * WARNING: This will permanently delete all users and expenses from the database
 * 
 * Usage: node backend/scripts/deleteAllAccounts.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import User from '../models/User.js';
import Expense from '../models/Expense.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const deleteAllAccounts = async () => {
  try {
    await connectDB();

    console.log('\n⚠️  WARNING: This will delete ALL users and expenses!');
    console.log('Starting deletion process...\n');

    // Count existing data
    const userCount = await User.countDocuments();
    const expenseCount = await Expense.countDocuments();

    console.log(`Found ${userCount} users and ${expenseCount} expenses`);

    if (userCount === 0 && expenseCount === 0) {
      console.log('✅ Database is already empty. Nothing to delete.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Delete all expenses first (to maintain referential integrity)
    if (expenseCount > 0) {
      const expenseResult = await Expense.deleteMany({});
      console.log(`✅ Deleted ${expenseResult.deletedCount} expenses`);
    }

    // Delete all users
    if (userCount > 0) {
      const userResult = await User.deleteMany({});
      console.log(`✅ Deleted ${userResult.deletedCount} users`);
    }

    console.log('\n✅ All accounts and data have been deleted successfully!');
    console.log('Database is now empty.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting accounts:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
deleteAllAccounts();
