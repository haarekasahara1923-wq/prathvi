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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-50"
          : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          scrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
        }}
      >
        <div className="container-custom py-1.5 flex justify-between items-center text-xs text-blue-200">
          <span>Prathvi Group of College — Morar, Gwalior (MP)</span>
          <a
            href="tel:+919826000001"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <Phone size={12} />
            +91 98260 00001
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Prathvi Group of College - Home">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
            >
              <GraduationCap className="text-amber-400" size={22} />
            </div>
            <div>
              <div
                className={`font-bold text-sm leading-tight transition-colors ${
                  scrolled ? "text-blue-900" : "text-blue-900"
                }`}
              >
                Prathvi Group
              </div>
              <div
                className={`text-xs transition-colors ${
                  scrolled ? "text-amber-600" : "text-amber-600"
                }`}
              >
                of College
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-900 font-semibold"
                    : "text-slate-700 hover:text-blue-900 hover:bg-blue-50"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact#enquiry-form" className="btn-accent text-sm py-2">
              Enquire Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-blue-50 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-900 font-semibold"
                      : "text-slate-700 hover:text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <Link href="/contact#enquiry-form" className="btn-accent w-full justify-center text-sm">
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
