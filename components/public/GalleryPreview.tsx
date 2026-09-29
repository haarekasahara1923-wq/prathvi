import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

interface GalleryItem {
  id: string;
  type: string;
  url: string;
  title?: string | null;
}

interface GalleryPreviewProps {
  items: GalleryItem[];
}

export default function GalleryPreview({ items }: GalleryPreviewProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Campus Life
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 section-title center">
            Photo Gallery
          </h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            A glimpse into our vibrant campus life, events, and learning environment.
          </p>
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-xl ${
                    idx === 0 ? "row-span-2" : ""
                  }`}
                  style={{ minHeight: idx === 0 ? "320px" : "150px" }}
                >
                  <Image
                    src={item.url}
                    alt={item.title || `Gallery image ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                      {item.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/gallery" className="btn-primary">
                <Images size={16} />
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Images size={48} className="mx-auto mb-4 opacity-40" />
            <p>Gallery coming soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
