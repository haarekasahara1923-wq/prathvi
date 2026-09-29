"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { contactSchema } from "@/lib/validators";

export async function getContactDetails() {
  return prisma.contactDetails.findFirst();
}

export async function updateContactDetails(formData: FormData) {
  await verifySession();

  const phones = (formData.get("phones") as string)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const emails = (formData.get("emails") as string)
    .split("\n")
    .map((e) => e.trim())
    .filter(Boolean);

  const raw = {
    address: formData.get("address") as string,
    phones,
    emails,
    whatsappNumber: (formData.get("whatsappNumber") as string) || "",
    whatsappGreeting: (formData.get("whatsappGreeting") as string) || undefined,
    workingHours: (formData.get("workingHours") as string) || undefined,
    mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || undefined,
    facebook: (formData.get("facebook") as string) || "",
    instagram: (formData.get("instagram") as string) || "",
    youtube: (formData.get("youtube") as string) || "",
    twitter: (formData.get("twitter") as string) || "",
    linkedin: (formData.get("linkedin") as string) || "",
  };

  const validated = contactSchema.parse(raw);

  const existing = await prisma.contactDetails.findFirst();
  let contact;

  if (existing) {
    contact = await prisma.contactDetails.update({
      where: { id: existing.id },
      data: validated,
    });
  } else {
    contact = await prisma.contactDetails.create({ data: validated });
  }

  revalidatePath("/contact", "page");
  revalidatePath("/", "layout");

  return { success: true, contact };
}
