import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: "user" | "admin";
}

const getSecret = (name: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"): string => {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is not defined in .env`);
  }

  return secret;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getSecret("JWT_ACCESS_SECRET"), {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getSecret("JWT_REFRESH_SECRET"), {
    expiresIn: "7d",
  });
};