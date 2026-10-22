import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { authMiddleware } from './src/middleware/auth.js';

import homeRoutes from './src/routes/home.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import workoutRoutes from './src/routes/workout.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import trainerRoutes from './src/routes/trainer.routes.js';
import nutritionistRoutes from './src/routes/nutritionist.routes.js';
import exerciseRoutes from './src/routes/exercise.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-auth-token', 'x-nutritionist-email', 'x-trainer-email']
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(authMiddleware);

// Routes
app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/nutritionist', nutritionistRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
async function startServer() {
  await connectDB();
  try {
    const { dataStore } = await import('./src/config/dataStore.js');
    await dataStore.ensureStaffLoginAccounts();
  } catch (err) {
    console.warn('Initial staff login accounts check note:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`============================================================`);
    console.log(`🚀 SmartFit AI Node.js Express Backend running on Port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`============================================================`);
  });
}

startServer();
