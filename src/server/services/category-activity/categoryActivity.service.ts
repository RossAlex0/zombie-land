import { prisma } from '@prismaInstance/*';
import { category_activity } from '../../../../prisma/generated/browser';

export const createCategoryActivity = async (body: Omit<category_activity, 'created_at'>) => {
  const result = await prisma.category_activity.create({
    data: body,
  });

  return result;
};
