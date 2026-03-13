import couponService from '../services/coupon.service';

export const expireCouponsJob = async (): Promise<void> => {
  try {
    const count = await couponService.expireCoupons();
    if (count > 0) {
      console.log(`✅ Expired ${count} coupon records`);
    }
  } catch (error) {
    console.error('❌ Error expiring coupons:', error);
  }
};

export default expireCouponsJob;
