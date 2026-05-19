import * as activityController from '@server/controllers/activity/activity.controller';
import { NextRequest, NextResponse } from 'next/server';
import type { NextContext } from '@customTypes/nextApi';

// GET /api/activity/:id
export async function GET(_req: NextRequest, context: NextContext<{ activityId: string }>) {
  const { activityId } = await context.params;
  const data = await activityController.readActivityById(Number(activityId));
  if (!data) {
    return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
  }
  return NextResponse.json({ data }, { status: 200 });
}
