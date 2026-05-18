// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@prismaInstance/*';

// GET /api/users
export async function GET() {
  const role = await prisma.role.findMany({});
  return NextResponse.json(role);
}
