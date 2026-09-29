import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Building2,
  Star,
} from "lucide-react";
import HeroSection from "@/components/public/HeroSection";
import StatsStrip from "@/components/public/StatsStrip";
import CollegeCard from "@/components/public/CollegeCard";
import GalleryPreview from "@/components/public/GalleryPreview";
import EnquiryCTABanner from "@/components/public/EnquiryCTABanner";

export const metadata: Metadata = {
  title: "Home | Prathvi Group of College — Quality Education in Gwalior",
  description:
    "Prathvi Group of College in Gwalior offers MBA, B.Ed, D.Ed, Law, ITI, Pharma and Distance Education. Enroll today for a brighter future.",
  alternates: { canonical: "/" },
};

export const revalidate = 0;

async function getHomeData() {
  const [collegeCount, courseCount, colleges, galleryItems, about] =
    await Promise.all([
      prisma.college.count({ where: { isActive: true } }),
      prisma.course.count(),
      prisma.college.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 4,
        include: { courses: { orderBy: { order: "asc" }, take: 5 } },
      }),
      prisma.galleryItem.findMany({
        where: { type: "IMAGE" },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.aboutContent.findFirst(),
    ]);

  return { collegeCount, courseCount, colleges, galleryItems, about };
}

export default async function HomePage() {
  const { collegeCount, courseCount, colleges, galleryItems, about } =
    await getHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Prathvi Group of College",
    description:
      "Premier educational institution in Gwalior, MP offering professional courses.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vill. Khureri, Behind Devraj Hospital, Morar",
      addressLocality: "Gwalior",
      addressRegion: "Madhya Pradesh",
      postalCode: "474006",
      addressCountry: "IN",
    },
    url: process.env.NEXT_PUBLIC_SITE_URL,
    numberOfStudents: { "@type": "QuantitativeValue", value: 5000 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Strip */}
      <StatsStrip collegeCount={collegeCount} courseCount={courseCount} />

      {/* About Snippet */}
      {about && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
                  About Us
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-5 section-title">
                  {about.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6 line-clamp-5">
                  {about.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-amber-500 font-bold text-2xl mb-1">{collegeCount}+</div>
                    <div className="text-blue-900 text-sm font-medium">Colleges</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="text-blue-900 font-bold text-2xl mb-1">{courseCount}+</div>
                    <div className="text-slate-600 text-sm font-medium">Courses</div>
                  </div>
                </div>
                <Link href="/about" className="btn-primary">
                  Learn More About Us <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #f59e0b)",
                    transform: "rotate(3deg)",
                  }}
                />
                {about.imageUrl ? (
                  <Image
                    src={about.imageUrl}
                    alt="Prathvi Group of College campus"
                    width={600}
                    height={400}
                    className="rounded-2xl relative z-10 object-cover w-full h-80 shadow-2xl"
                  />
                ) : (
                  <div
                    className="rounded-2xl relative z-10 w-full h-80 flex items-center justify-center shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                    }}
                  >
                    <div className="text-center text-white p-8">
                      <GraduationCap size={64} className="mx-auto mb-4 text-amber-400" />
                      <p className="text-xl font-semibold">Prathvi Group of College</p>
                      <p className="text-blue-200 text-sm mt-2">
                        Morar, Gwalior (MP)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Colleges Preview */}
      {colleges.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "#f0f4f8" }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
                Our Institutions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 section-title center">
                Our Colleges
              </h2>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                Explore our prestigious colleges offering diverse professional
                courses tailored for your career goals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} compact />
              ))}
            </div>
            <div className="text-center">
              <Link href="/colleges" className="btn-primary">
                View All Colleges & Courses <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Why Prathvi
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 section-title center">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <GraduationCap size={32} />,
                title: "Experienced Faculty",
                desc: "Learn from industry-experienced professors and educators dedicated to your success.",
              },
              {
                icon: <Building2 size={32} />,
                title: "Modern Infrastructure",
                desc: "State-of-the-art classrooms, labs, and learning facilities for the best experience.",
              },
              {
                icon: <BookOpen size={32} />,
                title: "Diverse Courses",
                desc: "Wide range of professional and vocational courses across multiple disciplines.",
              },
              {
                icon: <Award size={32} />,
                title: "Recognized Degrees",
                desc: "University-affiliated and government-recognized degrees with industry acceptance.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 card-hover text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                    color: "#f59e0b",
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {galleryItems.length > 0 && (
        <GalleryPreview items={galleryItems} />
      )}

      {/* Enquiry CTA */}
      <EnquiryCTABanner />
    </>
  );
}
