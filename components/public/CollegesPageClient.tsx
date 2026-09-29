"use client";

import { useState, useMemo } from "react";
import { Search, GraduationCap, X } from "lucide-react";
import CollegeCard from "@/components/public/CollegeCard";

interface Course {
  id: string;
  name: string;
  duration: string;
  description?: string | null;
  eligibility?: string | null;
}

interface College {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  address?: string | null;
  courses: Course[];
}

interface CollegesPageClientProps {
  colleges: College[];
  whatsappNumber: string;
  whatsappGreeting: string;
}

export default function CollegesPageClient({
  colleges,
  whatsappNumber,
  whatsappGreeting,
}: CollegesPageClientProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = colleges;

    if (activeFilter !== "all") {
      result = result.filter((c) => c.id === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.courses.some((course) => course.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [colleges, search, activeFilter]);

  return (
    <section className="py-12" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container-custom">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search colleges or courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                id="college-search"
                aria-label="Search colleges and courses"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* College filter chips */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === "all"
                    ? "bg-blue-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                }`}
              >
                All Colleges
              </button>
              {colleges.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    setActiveFilter(activeFilter === c.id ? "all" : c.id)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === c.id
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-amber-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="text-slate-500 text-sm mb-6">
            {filtered.length === 0
              ? "No results found"
              : `Showing ${filtered.length} college${filtered.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* Colleges Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                compact={false}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <GraduationCap size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium text-slate-500 mb-2">
              {colleges.length === 0
                ? "No colleges available yet"
                : "No colleges match your search"}
            </h3>
            <p className="text-sm">
              {colleges.length === 0
                ? "Colleges and courses will appear here once they are added by the admin."
                : "Try a different search term or clear the filter."}
            </p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 text-blue-600 text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
