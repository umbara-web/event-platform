import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import transactionRoutes from './transaction.routes';
import reviewRoutes from './review.routes';
import voucherRoutes from './voucher.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// API Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reviews', reviewRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
