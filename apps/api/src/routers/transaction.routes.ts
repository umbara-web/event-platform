import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import {
  createTransactionSchema,
  confirmTransactionSchema,
  getTransactionsQuerySchema,
  cancelTransactionSchema,
} from '../validators/transaction.validator';
import { idParamsSchema } from '../validators/common.validator';

const router = Router();

// All routes are protected
router.use(authenticate);

// Customer routes
router.post(
  '/',
  authorize('CUSTOMER'),
  validate(createTransactionSchema),
  transactionController.createTransaction
);

router.get(
  '/my',
  authorize('CUSTOMER'),
  validate(getTransactionsQuerySchema),
  transactionController.getMyTransactions
);

router.post(
  '/:id/payment-proof',
  authorize('CUSTOMER'),
  uploadSingle('paymentProof'),
  transactionController.uploadPaymentProof
);

router.post(
  '/:id/cancel',
  authorize('CUSTOMER'),
  validate(cancelTransactionSchema),
  transactionController.cancelTransaction
);

// Get single transaction (both roles)
router.get(
  '/:id',
  validate(idParamsSchema),
  transactionController.getTransaction
);

// Organizer routes
router.get(
  '/event/:eventId',
  authorize('ORGANIZER'),
  validate(getTransactionsQuerySchema),
  transactionController.getEventTransactions
);

router.post(
  '/:id/confirm',
  authorize('ORGANIZER'),
  validate(confirmTransactionSchema),
  transactionController.confirmTransaction
);

export default router;
