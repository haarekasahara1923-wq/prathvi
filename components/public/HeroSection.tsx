"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Play, Star, MapPin } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Prathvi Group of College Campus"
          fill
          priority
          className="object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950/90"></div>
      </div>

      <div className="container-custom relative z-10 pt-20 pb-16 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 glass-dark text-sm font-medium text-amber-400 border border-amber-500/30"
          >
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="tracking-wide uppercase text-xs font-bold">Premier Institution in Gwalior</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight"
          >
            Shape Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Future With Us
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-8 font-medium max-w-2xl leading-relaxed"
          >
            Join a legacy of excellence. Prathvi Group of College offers world-class education, state-of-the-art facilities, and diverse courses to build leaders of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Link href="/colleges" className="btn-accent text-base px-8 py-4 w-full sm:w-auto">
              Explore Courses
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact#enquiry-form"
              className="btn-outline white-outline text-base px-8 py-4 w-full sm:w-auto glass-panel hover:bg-white hover:text-slate-900 border-none"
            >
              <GraduationCap size={18} className="mr-2" />
              Apply for Admission
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-4 text-slate-400 text-sm font-medium"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" width={40} height={40} />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-white text-xs font-bold z-10">
                5k+
              </div>
            </div>
            <div>
              <p className="text-white font-bold">5,000+ Students</p>
              <p className="text-xs">Trust Prathvi Group</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-0 pointer-events-none mix-blend-screen"></div>
    </section>
  );
}
