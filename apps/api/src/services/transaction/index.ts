import { createTransaction } from './transaction-create.service';
import {
  uploadPaymentProof,
  confirmTransaction,
} from './transaction-payment.service';
import { cancelTransaction } from './transaction-cancel.service';
import {
  getTransaction,
  getTransactions,
} from './transaction-query.service';
import {
  expireTransactions,
  autoCancelTransactions,
} from './transaction-cron.service';

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
