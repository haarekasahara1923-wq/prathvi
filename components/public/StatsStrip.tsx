"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, TrendingUp } from "lucide-react";

interface StatsStripProps {
  collegeCount: number;
  courseCount: number;
}

export default function StatsStrip({ collegeCount, courseCount }: StatsStripProps) {
  const stats = [
    {
      icon: <GraduationCap size={28} />,
      value: `${collegeCount}+`,
      label: "Colleges",
    },
    {
      icon: <BookOpen size={28} />,
      value: `${courseCount}+`,
      label: "Courses Offered",
    },
    {
      icon: <Users size={28} />,
      value: "5000+",
      label: "Students Enrolled",
    },
    {
      icon: <TrendingUp size={28} />,
      value: "10+",
      label: "Years of Excellence",
    },
  ];

  return (
    <section
      className="py-8"
      style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center text-white"
            >
              <div className="mb-2 opacity-90">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-extrabold leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-amber-100 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
