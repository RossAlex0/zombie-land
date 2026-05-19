import { NextResponse } from 'next/server';
import * as activityController from '@server/controllers/activity/activity.controller';

// GET /api/activity
export async function GET() {
  const data = await activityController.readAllActivities();

  return NextResponse.json({ data }, { status: 200 });
}

// POST /api/activity
export async function POST(req: NextResponse) {
  const body = await req.json();

  const data = await activityController.create(body);

  return NextResponse.json({ data }, { status: 200 });
}
