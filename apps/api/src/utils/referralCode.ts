import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique referral code
 * Format: REF-XXXXXX (where X is alphanumeric uppercase)
 */
export const generateReferralCode = (): string => {
  const uuid = uuidv4().replace(/-/g, '');
  const code = uuid.substring(0, 8).toUpperCase();
  return `REF-${code}`;
};

/**
 * Validate referral code format
 */
export const isValidReferralCodeFormat = (code: string): boolean => {
  const referralCodeRegex = /^REF-[A-Z0-9]{8}$/;
  return referralCodeRegex.test(code);
};

export default {
  generateReferralCode,
  isValidReferralCodeFormat,
};
