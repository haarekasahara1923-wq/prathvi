"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Refresh on window focus (tab switch back)
    const handleFocus = () => router.refresh();
    window.addEventListener("visibilitychange", () => {
      if (!document.hidden) router.refresh();
    });

    // Poll every 30 seconds for updates
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => {
      window.removeEventListener("visibilitychange", handleFocus);
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
