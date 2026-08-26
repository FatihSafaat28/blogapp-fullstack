import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

const getJwtSecrets = () => {
  const accessSecret =
    process.env.JWT_ACCESS_SECRET ||
    'default-dev-super-secret-access-token-key-min-32-chars';
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET ||
    'default-dev-super-secret-refresh-token-key-min-32-chars';

  return { accessSecret, refreshSecret };
};

/**
 * Generate Access Token (Short-lived: 15m)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const { accessSecret } = getJwtSecrets();
  const expiry = process.env.JWT_ACCESS_EXPIRY || '15m';

  return jwt.sign(payload, accessSecret, {
    expiresIn: expiry as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Generate Refresh Token (Long-lived: 7d or custom expiry)
 */
export const generateRefreshToken = (
  payload: RefreshTokenPayload,
  expiresIn?: string
): string => {
  const { refreshSecret } = getJwtSecrets();
  const expiry = expiresIn || process.env.JWT_REFRESH_EXPIRY || '7d';

  return jwt.sign(payload, refreshSecret, {
    expiresIn: expiry as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const { accessSecret } = getJwtSecrets();
  return jwt.verify(token, accessSecret) as TokenPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const { refreshSecret } = getJwtSecrets();
  return jwt.verify(token, refreshSecret) as RefreshTokenPayload;
};
