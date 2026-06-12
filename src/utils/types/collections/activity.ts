import { activity, category } from '@prismaInstance/*';

export type ActivityWithCategory = activity & {
  category_activity: {
    activity_id: number;
    category_id: number;
    category: Pick<category, 'id' | 'label'>;
  }[];
};

export type ActivityPayload = {
  name?: string;
  description?: string;
  status?: string;
  picture?: File;
  category_activity?: { category_id: number }[];
};
