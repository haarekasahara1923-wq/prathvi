import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import CollegesPageClient from "@/components/public/CollegesPageClient";

export const metadata: Metadata = {
  title: "Colleges & Courses",
  description:
    "Explore all colleges and courses offered by Prathvi Group of College in Gwalior, MP. MBA, B.Ed, Law, ITI, Pharma and Distance Education.",
};

export const revalidate = 0;

async function getData() {
  const [colleges, contact] = await Promise.all([
    prisma.college.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        courses: { orderBy: { order: "asc" } },
      },
    }),
    prisma.contactDetails.findFirst({
      select: { whatsappNumber: true, whatsappGreeting: true },
    }),
  ]);
  return { colleges, contact };
}

export default async function CollegesPage() {
  const { colleges, contact } = await getData();

  return (
    <>
      {/* Page Header */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-custom relative z-10 text-center text-white">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Programs
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Colleges & Courses
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Discover the wide range of professional and vocational courses across
            our colleges
          </p>
        </div>
      </section>

      <CollegesPageClient
        colleges={colleges}
        whatsappNumber={contact?.whatsappNumber || ""}
        whatsappGreeting={contact?.whatsappGreeting || ""}
      />
    </>
  );
}
