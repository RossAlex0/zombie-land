import { prisma } from '@prismaInstance/*';
import { activityCreateInput } from '../../../../prisma/generated/models/activity';

export const getAllActivities = async () => {
  const activities = await prisma.activity.findMany({
    include: {
      category_activity: true,
    },
  });
  return activities;
};

export const getActivityById = async (id: number) => {
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      category_activity: true,
    },
  });
  return activity;
};

export const createActivity = async (body: Omit<activityCreateInput, 'category_activity'>) => {
  const result = await prisma.activity.create({ data: body });

  return result;
};
