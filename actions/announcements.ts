"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
  text: z.string().min(1, "Text is required"),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function getAnnouncements() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, announcements };
  } catch (error) {
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function addAnnouncement(data: any) {
  try {
    const validated = announcementSchema.parse(data);
    await prisma.announcement.create({
      data: validated,
    });
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add announcement" };
  }
}

export async function updateAnnouncement(id: string, data: any) {
  try {
    const validated = announcementSchema.parse(data);
    await prisma.announcement.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update announcement" };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete announcement" };
  }
}
