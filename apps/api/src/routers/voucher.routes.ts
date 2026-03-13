import { Router } from 'express';
import * as voucherController from '../controllers/voucher.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import {
  createVoucherSchema,
  updateVoucherSchema,
  validateVoucherSchema,
} from '../validators/voucher.validator';
import { idParamsSchema } from '../validators/common.validator';

const router = Router();

// All routes are protected
router.use(authenticate);

// Customer can validate voucher
router.post(
  '/validate',
  authorize('CUSTOMER'),
  validate(validateVoucherSchema),
  voucherController.validateVoucher
);

// Organizer routes
router.use(authorize('ORGANIZER'));

router.post(
  '/',
  validate(createVoucherSchema),
  voucherController.createVoucher
);

router.get('/event/:eventId', voucherController.getEventVouchers);

router.patch(
  '/:id',
  validate(updateVoucherSchema),
  voucherController.updateVoucher
);

router.delete(
  '/:id',
  validate(idParamsSchema),
  voucherController.deleteVoucher
);

export default router;
