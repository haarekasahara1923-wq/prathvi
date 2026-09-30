import { prisma } from "@/lib/db";
import AdminAnnouncementsClient from "@/components/admin/AdminAnnouncementsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | Admin Panel",
};

export const revalidate = 0;

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminAnnouncementsClient initialAnnouncements={announcements} />;
}
