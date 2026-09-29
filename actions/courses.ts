"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { courseSchema } from "@/lib/validators";

export async function getCoursesByCollege(collegeId: string) {
  return prisma.course.findMany({
    where: { collegeId },
    orderBy: { order: "asc" },
  });
}

export async function getAllCourses() {
  await verifySession();
  return prisma.course.findMany({
    orderBy: [{ college: { name: "asc" } }, { order: "asc" }],
    include: {
      college: { select: { id: true, name: true } },
    },
  });
}

export async function createCourse(formData: FormData) {
  await verifySession();

  const raw = {
    collegeId: formData.get("collegeId") as string,
    name: formData.get("name") as string,
    duration: formData.get("duration") as string,
    description: (formData.get("description") as string) || undefined,
    eligibility: (formData.get("eligibility") as string) || undefined,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const validated = courseSchema.parse(raw);
  const course = await prisma.course.create({ data: validated });

  revalidatePath("/colleges", "page");
  revalidatePath("/", "layout");

  return { success: true, course };
}

export async function updateCourse(id: string, formData: FormData) {
  await verifySession();

  const raw = {
    collegeId: formData.get("collegeId") as string,
    name: formData.get("name") as string,
    duration: formData.get("duration") as string,
    description: (formData.get("description") as string) || undefined,
    eligibility: (formData.get("eligibility") as string) || undefined,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const validated = courseSchema.parse(raw);
  const course = await prisma.course.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/colleges", "page");
  revalidatePath("/", "layout");

  return { success: true, course };
}

export async function deleteCourse(id: string) {
  await verifySession();

  await prisma.course.delete({ where: { id } });

  revalidatePath("/colleges", "page");
  revalidatePath("/", "layout");

  return { success: true };
}
