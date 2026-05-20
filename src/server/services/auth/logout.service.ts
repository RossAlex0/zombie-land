import { prisma } from '@prismaInstance/*';

export const logout = async (refreshToken: string) => {
  await prisma.refresh_token.deleteMany({
    where: { token: refreshToken },
  });
};
