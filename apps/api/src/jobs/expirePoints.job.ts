import pointService from '../services/point.service.js';

export const expirePointsJob = async (): Promise<void> => {
  try {
    const count = await pointService.expirePoints();
    if (count > 0) {
      console.log(`✅ Expired ${count} point records`);
    }
  } catch (error) {
    console.error('❌ Error expiring points:', error);
  }
};

export default expirePointsJob;
