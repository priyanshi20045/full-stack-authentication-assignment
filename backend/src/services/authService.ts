import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}
export const registerUser = async (
  data: RegisterInput
) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash,
  });

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (
  userId: string,
  refreshToken: string
) => {
  const user = await User.findById(userId);

  if (!user || !user.refreshTokenHash) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const tokenMatches = await bcrypt.compare(
    refreshToken,
    user.refreshTokenHash
  );

  if (!tokenMatches) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  const newRefreshTokenHash = await bcrypt.hash(
    newRefreshToken,
    12
  );

  user.refreshTokenHash = newRefreshTokenHash;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshTokenHash: 1,
    },
  });
};