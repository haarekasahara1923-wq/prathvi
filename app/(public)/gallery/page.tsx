import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import GalleryPageClient from "@/components/public/GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore our campus life, events, and facilities through our photo and video gallery.",
};

export const revalidate = 0;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const categories = [
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ] as string[];

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
            Campus Life
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Gallery</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            A visual journey through our vibrant campus, events, and achievements
          </p>
        </div>
      </section>

      <GalleryPageClient items={items} categories={categories} />
    </>
  );
}
