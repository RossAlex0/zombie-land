import { NextRequest } from 'next/server';
import { activityCreateSchema } from '@server/schemas';
import {
  createActivity,
  createCategoryActivity,
  getAllActivities,
  getActivityById,
} from '@server/services';

export const readAllActivities = async () => {
  const activites = await getAllActivities();
  return activites;
};

export const readActivityById = async (id: number) => {
  const activity = await getActivityById(id);
  return activity;
};

export const create = async (req: NextRequest) => {
  const activityBody = activityCreateSchema.parse(req);

  const activity = await createActivity(activityBody);

  const responseCategoryActivity = [];
  if (activityBody.category_activity) {
    for (const categoryActivy of activityBody.category_activity) {
      if (categoryActivy.category_id) {
        responseCategoryActivity.push(
          await createCategoryActivity({ ...categoryActivy, activity_id: activity.id })
        );
      }
    }
  }
  if (responseCategoryActivity) {
    return { ...activity, category_activity: responseCategoryActivity };
  }
  return activity;
};
