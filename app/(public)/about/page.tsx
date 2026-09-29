import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Target, Eye, Heart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Prathvi Group of College - our vision, mission, history and commitment to quality education in Gwalior, MP.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const about = await prisma.aboutContent.findFirst();

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500">
          <GraduationCap size={64} className="mx-auto mb-4 opacity-30" />
          <p>About content is being set up. Please check back soon.</p>
        </div>
      </div>
    );
  }

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
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Discover our commitment to quality education and student excellence
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
                Who We Are
              </p>
              <h2 className="text-3xl font-bold text-blue-900 mb-6 section-title">
                {about.title}
              </h2>
              <div className="prose prose-slate max-w-none">
                {about.description.split("\n").map((para, idx) => (
                  <p key={idx} className="text-slate-600 leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div>
              {about.imageUrl ? (
                <Image
                  src={about.imageUrl}
                  alt="Prathvi Group of College"
                  width={600}
                  height={450}
                  className="rounded-2xl shadow-2xl w-full object-cover"
                  style={{ maxHeight: "450px" }}
                />
              ) : (
                <div
                  className="rounded-2xl shadow-2xl w-full h-80 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                  }}
                >
                  <div className="text-center text-white p-8">
                    <GraduationCap size={64} className="mx-auto mb-4 text-amber-400" />
                    <p className="text-xl font-semibold">Prathvi Group of College</p>
                    <p className="text-blue-200 text-sm mt-2">Gwalior, MP</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="rounded-2xl p-8 border border-blue-100"
              style={{
                background: "linear-gradient(135deg, #f0f4ff, #e8f0fe)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                  }}
                >
                  <Eye className="text-amber-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-blue-900">Our Vision</h3>
              </div>
              <div className="text-slate-600 leading-relaxed">
                {about.vision.split("\n").map((para, idx) => (
                  <p key={idx} className="mb-2">{para}</p>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-8 border border-amber-100"
              style={{
                background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-amber-900">Our Mission</h3>
              </div>
              <div className="text-amber-900/70 leading-relaxed">
                {about.mission.split("\n").map((para, idx) => (
                  <p key={idx} className="mb-2">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
