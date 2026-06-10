import { NextContext } from '@customTypes/nextApi';
import { activityCreateSchema, activityUpdateSchema } from '@server/schemas';
import { ActivityModel, CategoryActivityModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';

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
    const body = await req.json();

    const { category_activity, ...activityBody } = activityCreateSchema.parse(body);

    const activityService = new ActivityModel();

    const activity = await activityService.create({ data: activityBody });

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
    const body = await req.json();

    const { category_activity, ...activityFields } = activityUpdateSchema.parse(body);

    const activityService = new ActivityModel();
    const activity = await activityService.updateById(Number(activityId), activityFields);

    if (category_activity !== undefined) {
      const categoryActivityService = new CategoryActivityModel();
      await categoryActivityService.deleteByActivityId(Number(activityId));
      for (const ca of category_activity) {
        await categoryActivityService.create({ data: { ...ca, activity_id: Number(activityId) } });
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
