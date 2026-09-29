"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { aboutSchema } from "@/lib/validators";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function getAbout() {
  return prisma.aboutContent.findFirst();
}

export async function updateAbout(formData: FormData) {
  await verifySession();

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    vision: formData.get("vision") as string,
    mission: formData.get("mission") as string,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    imagePublicId: (formData.get("imagePublicId") as string) || undefined,
  };

  const validated = aboutSchema.parse(raw);

  const existing = await prisma.aboutContent.findFirst();

  let about;
  if (existing) {
    // Delete old image from Cloudinary if replacing
    if (
      validated.imagePublicId &&
      existing.imagePublicId &&
      existing.imagePublicId !== validated.imagePublicId
    ) {
      await deleteFromCloudinary(existing.imagePublicId);
    }
    about = await prisma.aboutContent.update({
      where: { id: existing.id },
      data: validated,
    });
  } else {
    about = await prisma.aboutContent.create({ data: validated });
  }

  revalidatePath("/about");
  revalidatePath("/");

  return { success: true, about };
}
