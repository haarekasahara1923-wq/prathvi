"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { collegeSchema } from "@/lib/validators";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import slugify from "slugify";

function generateSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

export async function getColleges() {
  return prisma.college.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      courses: { orderBy: { order: "asc" } },
    },
  });
}

export async function getAllColleges() {
  await verifySession();
  return prisma.college.findMany({
    orderBy: { order: "asc" },
    include: {
      courses: { orderBy: { order: "asc" } },
      _count: { select: { courses: true, enquiries: true } },
    },
  });
}

export async function createCollege(formData: FormData) {
  await verifySession();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    imagePublicId: (formData.get("imagePublicId") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    order: parseInt(formData.get("order") as string) || 0,
    isActive: formData.get("isActive") === "true",
  };

  const validated = collegeSchema.parse(raw);
  const slug = generateSlug(validated.name);

  const college = await prisma.college.create({
    data: { ...validated, slug },
  });

  revalidatePath("/", "layout");
  revalidatePath("/colleges", "page");

  return { success: true, college };
}

export async function updateCollege(id: string, formData: FormData) {
  await verifySession();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    imagePublicId: (formData.get("imagePublicId") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    order: parseInt(formData.get("order") as string) || 0,
    isActive: formData.get("isActive") === "true",
  };

  const validated = collegeSchema.parse(raw);
  const slug = generateSlug(validated.name);

  const college = await prisma.college.update({
    where: { id },
    data: { ...validated, slug },
  });

  revalidatePath("/", "layout");
  revalidatePath("/colleges", "page");

  return { success: true, college };
}

export async function deleteCollege(id: string) {
  await verifySession();

  const college = await prisma.college.findUnique({ where: { id } });
  if (!college) throw new Error("College not found");

  // Delete image from Cloudinary if exists
  if (college.imagePublicId) {
    await deleteFromCloudinary(college.imagePublicId);
  }

  await prisma.college.delete({ where: { id } });

  revalidatePath("/", "layout");
  revalidatePath("/colleges", "page");

  return { success: true };
}

export async function toggleCollegeActive(id: string, isActive: boolean) {
  await verifySession();

  await prisma.college.update({ where: { id }, data: { isActive } });

  revalidatePath("/colleges", "page");

  return { success: true };
}
