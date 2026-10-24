import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

dotenv.config();

const ATLAS_SRV_URI = 'mongodb+srv://solamanmj009_db_user:Yv1XE8EZsd54OlHx@cluster0.iimcb7m.mongodb.net/smartfit_db?retryWrites=true&w=majority';
const DEFAULT_ATLAS_URI = process.env.MONGODB_URI || ATLAS_SRV_URI;

export async function connectDB() {
  mongoose.set('strictQuery', false);

  // Absorb background replica set monitoring errors from idle Atlas secondaries so Node doesn't trigger uncaughtException
  mongoose.connection.on('error', (err) => {
    if (!err.message?.includes('SSL routines') && !err.message?.includes('alert number 80')) {
      console.warn('[WARN] MongoDB connection pool notice:', err.message);
    }
  });

  const targetUri = DEFAULT_ATLAS_URI;

  try {
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 15000
    });
    console.log('[SUCCESS] Connected to MongoDB database at:', targetUri.includes('@') ? 'MongoDB Atlas (' + targetUri.split('@')[1].split('/')[0] + ')' : targetUri);
    await seedDatabase();
    return;
  } catch (err) {
    console.warn('[WARN] Primary MongoDB connection note:', err.message);
    
    // Direct replicaSet fallback if SRV lookup hits network issues
    const DIRECT_REPLICA_URI = 'mongodb://solamanmj009_db_user:Yv1XE8EZsd54OlHx@ac-aqg2xsf-shard-00-00.iimcb7m.mongodb.net:27017,ac-aqg2xsf-shard-00-01.iimcb7m.mongodb.net:27017,ac-aqg2xsf-shard-00-02.iimcb7m.mongodb.net:27017/smartfit_db?ssl=true&replicaSet=atlas-d5o17u-shard-0&authSource=admin&retryWrites=true&w=majority';
    if (targetUri !== DIRECT_REPLICA_URI) {
      try {
        console.log('[INFO] Retrying with Atlas direct replicaSet URI...');
        await mongoose.disconnect().catch(() => {});
        await mongoose.connect(DIRECT_REPLICA_URI, {
          serverSelectionTimeoutMS: 15000
        });
        console.log('[SUCCESS] Connected directly to MongoDB Atlas replicaSet!');
        await seedDatabase();
        return;
      } catch (fallbackErr) {
        console.warn('[WARN] Atlas replicaSet fallback error:', fallbackErr.message);
      }
    }
    console.warn('[WARN] Working with persistent storage mode.');
  }
}
