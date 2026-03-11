import { createTransaction } from './transaction-create.service.js';
import {
  uploadPaymentProof,
  confirmTransaction,
} from './transaction-payment.service.js';
import { cancelTransaction } from './transaction-cancel.service.js';
import {
  getTransaction,
  getTransactions,
} from './transaction-query.service.js';
import {
  expireTransactions,
  autoCancelTransactions,
} from './transaction-cron.service.js';

class TransactionService {
  createTransaction = createTransaction;
  uploadPaymentProof = uploadPaymentProof;
  confirmTransaction = confirmTransaction;
  cancelTransaction = cancelTransaction;
  getTransaction = getTransaction;
  getTransactions = getTransactions;
  expireTransactions = expireTransactions;
  autoCancelTransactions = autoCancelTransactions;
}

export const transactionService = new TransactionService();
export default transactionService;
