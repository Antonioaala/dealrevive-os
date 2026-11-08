import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Mock database already seeded with test data",
    status: "ok",
  });
}
