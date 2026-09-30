"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Trophy } from "lucide-react";

interface StatsStripProps {
  collegeCount: number;
  courseCount: number;
}

export default function StatsStrip({ collegeCount, courseCount }: StatsStripProps) {
  const stats = [
    { icon: <GraduationCap size={32} />, value: `${collegeCount}+`, label: "Colleges" },
    { icon: <BookOpen size={32} />, value: `${courseCount}+`, label: "Courses Offered" },
    { icon: <Users size={32} />, value: "5,000+", label: "Students Enrolled" },
    { icon: <Trophy size={32} />, value: "15+", label: "Years of Excellence" },
  ];

  return (
    <section className="relative z-20 -mt-10 lg:-mt-16 px-4">
      <div className="container-custom">
        <div className="glass-panel bg-white/90 rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/40 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x lg:divide-slate-200">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
