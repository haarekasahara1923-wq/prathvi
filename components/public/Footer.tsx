import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter, Linkedin, ExternalLink } from "lucide-react";
import type { ContactDetails } from "@prisma/client";

interface FooterProps {
  contact: ContactDetails | null;
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/colleges", label: "Colleges & Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer({ contact }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <div className="font-bold text-white text-2xl leading-none tracking-tight">
                  Prathvi Group
                </div>
                <div className="text-amber-400 font-semibold tracking-widest uppercase text-sm mt-1">
                  of College
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
              A premier educational institution in Gwalior, Madhya Pradesh. Dedicated to shaping the leaders of tomorrow with state-of-the-art facilities, experienced faculty, and industry-oriented vocational courses.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: contact?.facebook, label: "Facebook" },
                { icon: Instagram, href: contact?.instagram, label: "Instagram" },
                { icon: Youtube, href: contact?.youtube, label: "YouTube" },
                { icon: Twitter, href: contact?.twitter, label: "Twitter" },
                { icon: Linkedin, href: contact?.linkedin, label: "LinkedIn" },
              ].map((social, idx) => (
                social.href ? (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass-dark border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-amber-500 hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ) : null
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="font-bold text-white mb-6 text-lg tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 font-medium hover:text-amber-400 transition-colors flex items-center gap-3 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-amber-400 transition-colors"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-white mb-6 text-lg tracking-tight">
              Get in Touch
            </h3>
            <div className="space-y-6">
              {contact?.address && (
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg glass-dark border border-white/5 flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <MapPin size={18} className="text-amber-400" />
                  </div>
                  <span className="text-slate-400 text-sm leading-relaxed pt-2">{contact.address}</span>
                </div>
              )}
              {contact?.phones?.length ? (
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg glass-dark border border-white/5 flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <Phone size={18} className="text-amber-400" />
                  </div>
                  <div className="pt-2">
                    {contact.phones.map((phone) => (
                      <a key={phone} href={`tel:+91${phone}`} className="block text-slate-400 text-sm font-medium hover:text-amber-400 mb-1">
                        +91 {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {contact?.emails?.length ? (
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg glass-dark border border-white/5 flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <Mail size={18} className="text-amber-400" />
                  </div>
                  <div className="pt-2">
                    {contact.emails.map((email) => (
                      <a key={email} href={`mailto:${email}`} className="block text-slate-400 text-sm font-medium hover:text-amber-400 break-all mb-1">
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {currentYear} Prathvi Group of College. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring"></span>
            Admissions Open {currentYear}-{currentYear + 1}
          </div>
        </div>
      </div>
    </footer>
  );
}
