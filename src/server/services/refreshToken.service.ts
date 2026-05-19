import { prisma } from '@prismaInstance/*';

export const deleteMany = async (refreshToken: string) => {
  await prisma.refresh_token.deleteMany({
    where: { token: refreshToken },
  });
};
