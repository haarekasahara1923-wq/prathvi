"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { galleryItemSchema } from "@/lib/validators";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function getGalleryItems() {
  return prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGalleryItem(data: {
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId?: string;
  youtubeUrl?: string;
  title?: string;
  category?: string;
  order?: number;
}) {
  await verifySession();

  const validated = galleryItemSchema.parse({
    ...data,
    order: data.order || 0,
  });

  const item = await prisma.galleryItem.create({ data: validated });

  revalidatePath("/gallery");

  return { success: true, item };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  await verifySession();

  const raw = {
    type: formData.get("type") as "IMAGE" | "VIDEO",
    url: formData.get("url") as string,
    publicId: (formData.get("publicId") as string) || undefined,
    youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
    title: (formData.get("title") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const validated = galleryItemSchema.parse(raw);

  const item = await prisma.galleryItem.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/gallery");

  return { success: true, item };
}

export async function deleteGalleryItem(id: string) {
  await verifySession();

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) throw new Error("Gallery item not found");

  // Delete from Cloudinary if has publicId
  if (item.publicId) {
    await deleteFromCloudinary(
      item.publicId,
      item.type === "VIDEO" ? "video" : "image"
    );
  }

  await prisma.galleryItem.delete({ where: { id } });

  revalidatePath("/gallery");

  return { success: true };
}
