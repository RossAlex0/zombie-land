import { activity, category } from '@prismaInstance/*';

export type ActivityWithCategory = activity & {
  category_activity: {
    activity_id: number;
    category_id: number;
    category: Pick<category, 'id' | 'label'>;
  }[];
};
