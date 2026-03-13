import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { config } from '../configs/index';
import { JWTPayload, TokenPair } from '../types/index';
import { ApiError } from './ApiError';
import { MESSAGES } from '../constants/index';

/**
 * Parse duration string to milliseconds
 * Supports: 15m, 1h, 7d, 30d, etc.
 */
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2];

  switch (unit) {
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
};

// Parse duration string to seconds (for JWT expiresIn)
const parseDurationToSeconds = (duration: string): number => {
  return Math.floor(parseDuration(duration) / 1000);
};

// Generate access token
export const generateAccessToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: parseDurationToSeconds(config.jwt.accessExpiresIn),
    algorithm: 'HS256',
  };

  return jwt.sign(payload, config.jwt.accessSecret, options);
};

// Generate refresh token
export const generateRefreshToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: parseDurationToSeconds(config.jwt.refreshExpiresIn),
    algorithm: 'HS256',
  };

  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

// Generate both access and refresh tokens
export const generateTokenPair = (payload: JWTPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload &
      JWTPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_TOKEN);
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload &
      JWTPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_TOKEN);
  }
};

// Get refresh token expiry date
export const getRefreshTokenExpiry = (): Date => {
  const expiryMs = parseDuration(config.jwt.refreshExpiresIn);
  return new Date(Date.now() + expiryMs);
};

// Decode token without verification (for expired tokens)
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload & JWTPayload;
    if (!decoded) return null;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch {
    return null;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  decodeToken,
};
