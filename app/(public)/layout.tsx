import { Toaster } from "react-hot-toast";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import AnnouncementBar from "@/components/public/AnnouncementBar";
import { prisma } from "@/lib/db";
import ClientRefresh from "@/components/public/ClientRefresh";

export const revalidate = 0;

async function getLayoutData() {
  const [contact, colleges, announcement] = await Promise.all([
    prisma.contactDetails.findFirst(),
    prisma.college.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        courses: {
          orderBy: { order: "asc" },
          select: { id: true, name: true },
        },
      },
    }),
    prisma.announcement.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { contact, colleges, announcement };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { contact, colleges, announcement } = await getLayoutData();

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar announcement={announcement} />
      <Navbar />
      {/* Pad top to account for navbar and announcement bar */}
      <main className="flex-1 pt-0">{children}</main>
      <Footer contact={contact} />
      {contact?.whatsappNumber && (
        <WhatsAppButton
          whatsappNumber={contact.whatsappNumber}
          whatsappGreeting={contact.whatsappGreeting || undefined}
          colleges={colleges}
        />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e3a5f",
            color: "#fff",
            borderRadius: "0.75rem",
            fontFamily: "var(--font-poppins)",
          },
          success: {
            iconTheme: { primary: "#f59e0b", secondary: "#fff" },
          },
        }}
      />
      <ClientRefresh />
    </div>
  );
}
