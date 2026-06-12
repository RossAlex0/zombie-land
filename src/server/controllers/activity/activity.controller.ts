import { NextContext } from '@customTypes/nextApi';
import { activityCreateSchema, activityUpdateSchema } from '@server/schemas';
import { ActivityModel, CategoryActivityModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@lib/cloudinary';

const selectActivityWithCategory = {
  select: {
    id: true,
    updated_at: true,
    created_at: true,
    name: true,
    status: true,
    picture: true,
    description: true,
    category_activity: {
      select: {
        category_id: true,
        activity_id: true,
        category: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    },
  },
};

export const activityController = {
  readAllActivities: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let args;

    if (category) {
      args = {
        ...selectActivityWithCategory,
        where: {
          category_activity: {
            some: { category_id: Number(category) },
          },
        },
      };
    } else {
      args = selectActivityWithCategory;
    }

    const activityService = new ActivityModel();
    const activites = await activityService.readAll({
      ...args,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ data: activites }, { status: 200 });
  },

  readActivityById: async (_req: NextRequest, context: NextContext<{ activityId: string }>) => {
    const { activityId } = await context.params;

    const activityService = new ActivityModel();

    const activity = await activityService.getActivityById(
      Number(activityId),
      selectActivityWithCategory
    );

    return NextResponse.json({ data: activity }, { status: 200 });
  },

  create: async (req: NextRequest) => {
    const formData = await req.formData();

    const rawCategoryActivity = formData.get('category_activity');
    const bodyToValidate = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      status: formData.get('status') || undefined,
      category_activity: rawCategoryActivity
        ? JSON.parse(rawCategoryActivity as string)
        : undefined,
    };

    const { category_activity, ...activityBody } = activityCreateSchema.parse(bodyToValidate);

    const file = formData.get('picture');
    let pictureUrl: string | undefined;
    if (file instanceof File && file.size > 0) {
      pictureUrl = await uploadImage(file);
    }

    const activityService = new ActivityModel();

    const activity = await activityService.create({
      data: { ...activityBody, picture: pictureUrl },
    });

    const responseCategoryActivity = [];
    if (category_activity) {
      for (const categoryActivy of category_activity) {
        if (categoryActivy.category_id) {
          const categoryActivityService = new CategoryActivityModel();
          responseCategoryActivity.push(
            await categoryActivityService.create({
              data: { ...categoryActivy, activity_id: activity.id },
            })
          );
        }
      }
    }

    if (responseCategoryActivity.length) {
      return NextResponse.json(
        { data: { ...activity, category_activity: responseCategoryActivity } },
        { status: 201 }
      );
    }
    return NextResponse.json({ data: activity }, { status: 201 });
  },

  update: async (req: NextRequest, context: NextContext<{ activityId: string }>) => {
    const { activityId } = await context.params;
    const formData = await req.formData();

    const rawCategoryActivity = formData.get('category_activity');
    const bodyToValidate = {
      name: formData.get('name') || undefined,
      description: formData.get('description') || undefined,
      status: formData.get('status') || undefined,
      category_activity: rawCategoryActivity
        ? JSON.parse(rawCategoryActivity as string)
        : undefined,
    };

    const { category_activity, ...activityFields } = activityUpdateSchema.parse(bodyToValidate);

    const file = formData.get('picture');
    const dataToUpdate: typeof activityFields & { picture?: string } = { ...activityFields };
    if (file instanceof File && file.size > 0) {
      dataToUpdate.picture = await uploadImage(file);
    }

    const activityService = new ActivityModel();
    const activity = await activityService.updateById(Number(activityId), dataToUpdate);

    if (category_activity !== undefined) {
      const categoryActivityService = new CategoryActivityModel();
      await categoryActivityService.deleteByActivityId(Number(activityId));
      for (const ca of category_activity) {
        await categoryActivityService.create({
          data: { ...ca, activity_id: Number(activityId) },
        });
      }
    }

    return NextResponse.json({ data: activity }, { status: 200 });
  },

  delete: async (_req: NextRequest, context: NextContext<{ activityId: string }>) => {
    const { activityId } = await context.params;

    const activityService = new ActivityModel();
    await activityService.deleteById(Number(activityId));

    return NextResponse.json({ data: null }, { status: 200 });
  },
};
