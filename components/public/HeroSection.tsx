"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ChevronDown, Star, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 34, 64, 0.9) 0%, rgba(30, 58, 95, 0.8) 50%, rgba(13, 27, 46, 0.9) 100%), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-amber-400 opacity-60"
          animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-blue-400 opacity-40"
          animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-white opacity-40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container-custom relative z-10 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium text-amber-300"
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <Star size={14} className="text-amber-400" />
            Premier Educational Institution in Gwalior, MP
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Prathvi Group{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              of College
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-200 mb-4 font-medium"
          >
            Shaping Futures, Building Leaders
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-blue-300 text-sm mb-10"
          >
            <MapPin size={14} />
            <span>Vill. Khureri, Behind Devraj Hospital, Morar, Gwalior (MP)</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/colleges" className="btn-accent text-base px-8 py-3">
              <GraduationCap size={20} />
              Explore Colleges
            </Link>
            <Link
              href="/contact#enquiry-form"
              className="btn-outline text-base px-8 py-3 border-white/40 text-white hover:bg-white/10 hover:border-white"
            >
              Enquire Now
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/40"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
