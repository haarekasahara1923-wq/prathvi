"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10"
          : "py-4 bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Prathvi Group of College - Home">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <div className="font-bold text-lg leading-none text-white tracking-tight">
                Prathvi Group
              </div>
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mt-1">
                of College
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 glass-dark px-2 py-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+919826000001" className="hidden xl:flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors text-sm font-semibold">
              <Phone size={16} />
              +91 98260 00001
            </a>
            <Link href="/contact#enquiry-form" className="btn-accent py-2.5 px-6 shadow-amber-500/20 shadow-lg">
              Enquire Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl"
          >
            <div className="container-custom py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-4 rounded-xl text-base font-semibold transition-all ${
                    pathname === link.href
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-4">
                <a href="tel:+919826000001" className="flex items-center justify-center gap-2 text-slate-300 py-3 font-semibold">
                  <Phone size={18} />
                  +91 98260 00001
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
