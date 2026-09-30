import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  ExternalLink,
} from "lucide-react";
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
    <footer
      className="text-white mt-auto"
      style={{
        background: "linear-gradient(135deg, #0f2240 0%, #1e3a5f 50%, #152b47 100%)",
      }}
    >
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
              >
                <GraduationCap className="text-white" size={26} />
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight">
                  Prathvi Group
                </div>
                <div className="text-amber-400 text-sm">of College</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-6 max-w-md">
              Premier educational institution in Gwalior, MP offering
              professional and vocational courses for a brighter future. We are dedicated to shaping leaders of tomorrow with state-of-the-art facilities and experienced faculty.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {contact?.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {contact?.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              {contact?.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              )}
              {contact?.twitter && (
                <a
                  href={contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter size={16} />
                </a>
              )}
              {contact?.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contact?.address && (
                <div className="flex gap-3 text-sm text-blue-200">
                  <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{contact.address}</span>
                </div>
              )}
              {contact?.phones?.length ? (
                <div className="flex gap-3 text-sm text-blue-200">
                  <Phone size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    {contact.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:+91${phone}`}
                        className="block hover:text-amber-400 transition-colors"
                      >
                        +91 {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {contact?.emails?.length ? (
                <div className="flex gap-3 text-sm text-blue-200">
                  <Mail size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    {contact.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block hover:text-amber-400 transition-colors break-all"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {contact?.workingHours && (
                <div className="flex gap-3 text-sm text-blue-200">
                  <Clock size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{contact.workingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-300">
          <p>
            &copy; {currentYear} Prathvi Group of College. All rights reserved.
          </p>
          <p className="text-xs">
            Vill. Khureri, Behind Devraj Hospital, Morar, Gwalior (MP)
          </p>
        </div>
      </div>
    </footer>
  );
}
