"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, Film, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId?: string | null;
  youtubeUrl?: string | null;
  title?: string | null;
  category?: string | null;
}

interface GalleryPageClientProps {
  items: GalleryItem[];
  categories: string[];
}

type TabType = "all" | "IMAGE" | "VIDEO";

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

export default function GalleryPageClient({
  items,
  categories,
}: GalleryPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = items.filter((item) => {
    const tabMatch = activeTab === "all" || item.type === activeTab;
    const catMatch =
      activeCategory === "all" || item.category === activeCategory;
    return tabMatch && catMatch;
  });

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevItem = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);
  const nextItem = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );
  }, [filtered.length]);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section className="py-12" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container-custom">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Type tabs */}
            <div className="flex gap-2">
              {([
                { key: "all", label: "All", icon: <Grid size={14} /> },
                { key: "IMAGE", label: "Images", icon: <Images size={14} /> },
                { key: "VIDEO", label: "Videos", icon: <Film size={14} /> },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Category filters */}
            {categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === "all"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-amber-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-amber-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid (masonry) */}
        {filtered.length > 0 ? (
          <div className="masonry-grid">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="masonry-item relative overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => item.type === "IMAGE" && openLightbox(idx)}
              >
                {item.type === "IMAGE" ? (
                  <div className="relative">
                    <Image
                      src={item.url}
                      alt={item.title || "Gallery image"}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAHBAAAQQDAQAAAAAAAAAAAAAAAQIDBAUREiH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlpR61VZCFaqGcnk7aUrJTHY3JhNjjTwxmwFV2v/Z"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <div className="text-white text-sm font-medium px-3 py-1.5 bg-black/50 rounded-lg">
                        {item.title || "View Image"}
                      </div>
                    </div>
                    {item.category && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-md">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>
                ) : item.youtubeUrl ? (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(item.youtubeUrl)}`}
                      title={item.title || "Video"}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    />
                    {item.title && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Images size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium text-slate-500 mb-2">
              No gallery items yet
            </h3>
            <p className="text-sm">
              Images and videos will appear here once they are uploaded.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevItem(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-4xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentItem.url}
                alt={currentItem.title || "Gallery image"}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
              {currentItem.title && (
                <div className="text-center text-white mt-3 text-sm font-medium">
                  {currentItem.title}
                </div>
              )}
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextItem(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Counter */}
            {filtered.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/50 rounded-full text-white text-sm">
                {(lightboxIndex ?? 0) + 1} / {filtered.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
