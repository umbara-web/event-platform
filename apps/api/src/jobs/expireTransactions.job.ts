import transactionService from '../services/transaction/index';

export const expireTransactionsJob = async (): Promise<void> => {
  try {
    const count = await transactionService.expireTransactions();
    if (count > 0) {
      console.log(`✅ Expired ${count} transactions`);
    }
  } catch (error) {
    console.error('❌ Error expiring transactions:', error);
  }
};

export default expireTransactionsJob;
