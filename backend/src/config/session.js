// Single source of truth for authentication / session configuration.
// Used by token generation and cookie settings so expiry values never drift apart.

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

// Access token: short-lived.
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
// Refresh token / persistent session: at least 7 days.
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Derived cookie max-ages in milliseconds.
const ACCESS_COOKIE_MAX_AGE_MS = 15 * SECONDS_PER_MINUTE * 1000;
const REFRESH_COOKIE_MAX_AGE_MS = 7 * SECONDS_PER_DAY * 1000;

const accessTokenTtlSeconds = (() => {
  const raw = ACCESS_TOKEN_TTL;
  const match = /^(\d+)([smhd])$/.exec(raw);
  if (!match) return 15 * SECONDS_PER_MINUTE;
  const value = Number(match[1]);
  switch (match[2]) {
    case 's':
      return value;
    case 'm':
      return value * SECONDS_PER_MINUTE;
    case 'h':
      return value * SECONDS_PER_HOUR;
    case 'd':
      return value * SECONDS_PER_DAY;
    default:
      return 15 * SECONDS_PER_MINUTE;
  }
})();

const refreshTokenTtlSeconds = (() => {
  const raw = REFRESH_TOKEN_TTL;
  const match = /^(\d+)([smhd])$/.exec(raw);
  if (!match) return 7 * SECONDS_PER_DAY;
  const value = Number(match[1]);
  switch (match[2]) {
    case 's':
      return value;
    case 'm':
      return value * SECONDS_PER_MINUTE;
    case 'h':
      return value * SECONDS_PER_HOUR;
    case 'd':
      return value * SECONDS_PER_DAY;
    default:
      return 7 * SECONDS_PER_DAY;
  }
})();

export const sessionConfig = {
  accessTokenTtl: ACCESS_TOKEN_TTL,
  refreshTokenTtl: REFRESH_TOKEN_TTL,
  accessTokenTtlSeconds,
  refreshTokenTtlSeconds,
  // Cookie max-ages (already in ms for Express res.cookie).
  accessCookieMaxAgeMs: ACCESS_COOKIE_MAX_AGE_MS,
  refreshCookieMaxAgeMs: REFRESH_COOKIE_MAX_AGE_MS,
};

export default sessionConfig;
