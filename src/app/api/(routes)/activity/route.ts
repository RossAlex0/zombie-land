import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import * as activityController from '@server/controllers/activity/activity.controller';

// GET /api/activity
export async function GET() {
  try {
    const data = await activityController.readAllActivities();
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/activity
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await activityController.create(body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
