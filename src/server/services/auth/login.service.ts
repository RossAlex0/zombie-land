import argon2 from 'argon2';
import { prisma } from '@prismaInstance/*';
import { generateAccessToken, generateRefreshToken } from './token.service';

export type LoginResult = { ok: true; accessToken: string; refreshToken: string } | { ok: false };

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false };

   const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) return { ok: false };

  const accessToken = await generateAccessToken(user.id, user.role_id);
  const refreshToken = await generateRefreshToken(user.id);

  return { ok: true, accessToken, refreshToken };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
