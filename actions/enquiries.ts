"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { enquirySchema, whatsappEnquirySchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendWhatsAppNotification, buildEnquiryMessage } from "@/lib/whatsapp";

export async function submitEnquiry(
  data: {
    name: string;
    phone: string;
    email?: string;
    collegeId?: string;
    courseId?: string;
    message: string;
    honeypot?: string;
    source?: "FORM" | "WHATSAPP";
  },
  ip: string
) {
  // Honeypot check
  if (data.honeypot) {
    return { success: false, error: "Bot detected" };
  }

  // Rate limit check
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: "Too many submissions. Please try again after 1 hour.",
    };
  }

  // Validate
  const validated = enquirySchema.parse(data);

  // Get college/course names for denormalization
  let collegeName: string | undefined;
  let courseName: string | undefined;

  if (validated.collegeId) {
    const college = await prisma.college.findUnique({
      where: { id: validated.collegeId },
      select: { name: true },
    });
    collegeName = college?.name;
  }

  if (validated.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
      select: { name: true },
    });
    courseName = course?.name;
  }

  // Save enquiry
  const enquiry = await prisma.enquiry.create({
    data: {
      name: validated.name,
      phone: validated.phone,
      email: validated.email || null,
      collegeId: validated.collegeId || null,
      courseId: validated.courseId || null,
      collegeName: collegeName || null,
      courseName: courseName || null,
      message: validated.message,
      source: data.source || "FORM",
      status: "NEW",
      ipAddress: ip,
    },
  });

  // Optional: send WhatsApp notification to admin
  const adminNotifyNumber = process.env.ADMIN_NOTIFY_NUMBER;
  if (adminNotifyNumber) {
    const contact = await prisma.contactDetails.findFirst();
    const message = buildEnquiryMessage({
      name: validated.name,
      mobile: validated.phone,
      college: collegeName,
      course: courseName,
      message: validated.message,
      greeting: `New Enquiry from ${validated.name}:`,
    });
    await sendWhatsAppNotification({ to: adminNotifyNumber, message });
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");

  return { success: true, enquiry };
}

export async function submitWhatsAppEnquiry(
  data: {
    name: string;
    phone: string;
    collegeId?: string;
    courseId?: string;
    message?: string;
    honeypot?: string;
  },
  ip: string
) {
  // Honeypot check
  if (data.honeypot) {
    return { success: false, error: "Bot detected" };
  }

  const validated = whatsappEnquirySchema.parse(data);

  let collegeName: string | undefined;
  let courseName: string | undefined;

  if (validated.collegeId) {
    const college = await prisma.college.findUnique({
      where: { id: validated.collegeId },
      select: { name: true },
    });
    collegeName = college?.name;
  }

  if (validated.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
      select: { name: true },
    });
    courseName = course?.name;
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: validated.name,
      phone: validated.phone,
      collegeId: validated.collegeId || null,
      courseId: validated.courseId || null,
      collegeName: collegeName || null,
      courseName: courseName || null,
      message: validated.message || "WhatsApp enquiry",
      source: "WHATSAPP",
      status: "NEW",
      ipAddress: ip,
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");

  return { success: true, enquiry, collegeName, courseName };
}

export async function getEnquiries(filters?: {
  status?: string;
  source?: string;
  search?: string;
}) {
  await verifySession();

  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters?.source && filters.source !== "ALL") {
    where.source = filters.source;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      college: { select: { name: true } },
      course: { select: { name: true } },
    },
  });
}

export async function updateEnquiryStatus(
  id: string,
  status: "NEW" | "CONTACTED" | "CLOSED",
  adminNote?: string
) {
  await verifySession();

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: {
      status,
      ...(adminNote !== undefined ? { adminNote } : {}),
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");

  return { success: true, enquiry };
}

export async function deleteEnquiry(id: string) {
  await verifySession();

  await prisma.enquiry.delete({ where: { id } });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function getDashboardStats() {
  await verifySession();

  const [colleges, courses, galleryItems, newEnquiries, latestEnquiries] =
    await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.galleryItem.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          college: { select: { name: true } },
          course: { select: { name: true } },
        },
      }),
    ]);

  return { colleges, courses, galleryItems, newEnquiries, latestEnquiries };
}
