import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartfit_db';

export async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('[SUCCESS] Connected to MongoDB database at:', MONGODB_URI);
    await seedDatabase();
  } catch (err) {
    console.warn('[WARN] MongoDB server is not running on port 27017. Working with persistent storage mode:', err.message);
  }
}

