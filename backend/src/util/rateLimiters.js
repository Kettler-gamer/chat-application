import RateLimit from "express-rate-limit";

export const defaultLimiter = RateLimit({
  limit: 30,
  windowMs: 1 * 60 * 1000,
});

export const loginLimiter = RateLimit({
  limit: 3,
  windowMs: 15 * 60 * 1000,
});

export const registerLimiter = RateLimit({
  limit: 3,
  windowMs: 24 * 60 * 60 * 1000,
});
