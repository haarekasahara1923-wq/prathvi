"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/colleges", label: "Colleges & Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-[40px] md:top-[48px] left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "py-4 bg-transparent"
      }`}
    >
      {/* Increased width container */}
      <nav className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-4 group" aria-label="Prathvi Group of College - Home">
            {/* Logo Placeholder for Admin */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 border-2 border-amber-500/30">
              <img 
                src="/logo-placeholder.png" 
                alt="Prathvi Group Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="font-extrabold text-xl md:text-3xl leading-none text-white tracking-tight drop-shadow-md">
                PRATHVI GROUP
              </div>
              <div className="text-sm md:text-base font-bold text-amber-400 tracking-[0.2em] uppercase mt-1 drop-shadow-sm">
                OF COLLEGE
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-2 glass-dark px-2 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA & Blinking Call Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:7880164004" 
              className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-red-600/30 transition-colors animate-pulse"
            >
              <PhoneCall size={18} className="animate-bounce" />
              CALL NOW
            </a>
            <Link href="/contact#enquiry-form" className="btn-accent py-2.5 px-6 shadow-amber-500/20 shadow-lg text-sm">
              Enquire Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-4 rounded-xl text-lg font-bold transition-all ${
                    pathname === link.href
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-4">
                <a 
                  href="tel:7880164004" 
                  className="flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-xl font-bold text-lg animate-pulse shadow-lg shadow-red-600/20"
                >
                  <PhoneCall size={22} />
                  CALL NOW: 7880164004
                </a>
                <Link href="/contact#enquiry-form" className="btn-accent w-full text-center py-4 text-lg shadow-amber-500/20">
                  Enquire Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
