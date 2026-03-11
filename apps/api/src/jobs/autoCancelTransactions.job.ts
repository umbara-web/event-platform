import transactionService from '../services/transaction/index.js';

export const autoCancelTransactionsJob = async (): Promise<void> => {
  try {
    const count = await transactionService.autoCancelTransactions();
    if (count > 0) {
      console.log(`✅ Auto-cancelled ${count} transactions`);
    }
  } catch (error) {
    console.error('❌ Error auto-cancelling transactions:', error);
  }
};

export default autoCancelTransactionsJob;
