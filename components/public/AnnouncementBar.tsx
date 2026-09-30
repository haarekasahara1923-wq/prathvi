"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Announcement } from "@prisma/client";

interface AnnouncementBarProps {
  announcement: Announcement | null;
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement || !announcement.isActive || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 px-4 py-2 relative z-[60] flex items-center justify-center min-h-[40px] md:min-h-[48px] border-b border-amber-600/20 shadow-md">
      <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold tracking-wide w-full max-w-[1600px] pr-8">
        <AlertCircle size={16} className="shrink-0 animate-pulse" />
        <span className="marquee-content text-center line-clamp-1 md:line-clamp-none">
          {announcement.link ? (
            <Link href={announcement.link} className="hover:underline decoration-slate-900/50 underline-offset-4">
              {announcement.text}
            </Link>
          ) : (
            <span>{announcement.text}</span>
          )}
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 md:right-4 p-1 rounded-full hover:bg-slate-900/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
