import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get("collegeId");

  if (!collegeId) {
    return NextResponse.json({ courses: [] });
  }

  const courses = await prisma.course.findMany({
    where: { collegeId },
    orderBy: { order: "asc" },
    select: { id: true, name: true, duration: true },
  });

  return NextResponse.json({ courses });
}
