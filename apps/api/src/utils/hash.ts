import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate random token for password reset, etc.
export const generateRandomToken = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export default {
  hashPassword,
  comparePassword,
  generateRandomToken,
};
