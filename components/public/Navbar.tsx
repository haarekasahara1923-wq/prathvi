"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/colleges", label: "Colleges" },
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg"
          : "py-5 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
      }`}
      style={{ marginTop: "40px" }} // Account for announcement bar
    >
      <nav className="container-custom mx-auto px-4 w-full">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Prathvi Group of College - Home">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow-md border-2 border-amber-500 overflow-hidden flex items-center justify-center p-1">
              <img 
                src="/logo-placeholder.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
                }}
              />
            </div>
            <div className="flex flex-col shrink-0">
              <div className="font-extrabold text-xl md:text-2xl lg:text-3xl text-slate-900 tracking-tight leading-none">
                PRATHVI GROUP
              </div>
              <div className="text-xs md:text-sm font-bold text-amber-500 tracking-[0.15em] uppercase mt-1">
                OF COLLEGE
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 xl:px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  pathname === link.href
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a 
              href="tel:7880164004" 
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold shadow-md animate-pulse transition-colors"
            >
              <PhoneCall size={18} />
              <span className="hidden xl:inline">Call Now</span>
            </a>
            <Link href="/contact#enquiry-form" className="btn-accent py-2.5 px-6 shadow-md text-sm">
              Enquire Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay to avoid any overlap issues */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[100%] left-0 right-0 bg-white border-b border-slate-200 shadow-2xl overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-4 rounded-xl text-lg font-bold transition-all ${
                    pathname === link.href
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-6 mt-4 border-t border-slate-200 flex flex-col gap-4">
                <a 
                  href="tel:7880164004" 
                  className="flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg animate-pulse"
                >
                  <PhoneCall size={22} />
                  Call Now: 7880164004
                </a>
                <Link href="/contact#enquiry-form" className="btn-accent w-full text-center py-4 text-lg">
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
