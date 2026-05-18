// src/app/api/users/route.ts
import { NextResponse } from "next/server";

// GET /api/users
export async function GET() {
  return NextResponse.json([{ name: "John Doe", email: "email@gmail.com" }]);
}
