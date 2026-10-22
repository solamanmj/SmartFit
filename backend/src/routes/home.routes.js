import express from 'express';

const router = express.Router();

// GET /
router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'UP',
    service: 'SmartFit AI Backend API (Node.js Express)',
    version: '1.0.0',
    message: 'SmartFit REST API server is active and running on port 8081.',
    authEndpoints: '/api/auth/register, /api/auth/login'
  });
});

// GET /api/health
router.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'UP',
    timestamp: Date.now()
  });
});

export default router;
