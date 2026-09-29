import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import EnquiryForm from "@/components/public/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Prathvi Group of College. Visit us at Morar, Gwalior or reach out for admissions enquiries.",
};

export const revalidate = 0;

async function getData() {
  const [contact, colleges] = await Promise.all([
    prisma.contactDetails.findFirst(),
    prisma.college.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        courses: {
          orderBy: { order: "asc" },
          select: { id: true, name: true },
        },
      },
    }),
  ]);
  return { contact, colleges };
}

export default async function ContactPage() {
  const { contact, colleges } = await getData();

  const socialLinks = contact
    ? [
        { href: contact.facebook, icon: <Facebook size={18} />, label: "Facebook" },
        { href: contact.instagram, icon: <Instagram size={18} />, label: "Instagram" },
        { href: contact.youtube, icon: <Youtube size={18} />, label: "YouTube" },
        { href: contact.twitter, icon: <Twitter size={18} />, label: "Twitter" },
        { href: contact.linkedin, icon: <Linkedin size={18} />, label: "LinkedIn" },
      ].filter((s) => s.href)
    : [];

  return (
    <>
      {/* Page Header */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-custom relative z-10 text-center text-white">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            We are here to help you with admissions, courses, and any questions
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-5 section-title">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contact?.address && (
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                        }}
                      >
                        <MapPin className="text-amber-400" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                          Address
                        </p>
                        <p className="text-slate-700 text-sm">{contact.address}</p>
                      </div>
                    </div>
                  )}

                  {contact?.phones && contact.phones.length > 0 && (
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                        }}
                      >
                        <Phone className="text-amber-400" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                          Phone
                        </p>
                        {contact.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:+91${phone}`}
                            className="block text-slate-700 text-sm hover:text-blue-700 transition-colors"
                          >
                            +91 {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {contact?.emails && contact.emails.length > 0 && (
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                        }}
                      >
                        <Mail className="text-amber-400" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                          Email
                        </p>
                        {contact.emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="block text-slate-700 text-sm hover:text-blue-700 transition-colors"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {contact?.workingHours && (
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                        }}
                      >
                        <Clock className="text-amber-400" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                          Working Hours
                        </p>
                        <p className="text-slate-700 text-sm">
                          {contact.workingHours}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                      Follow Us
                    </p>
                    <div className="flex gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                          style={{
                            background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
                          }}
                          aria-label={social.label}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              {contact?.mapEmbedUrl && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="h-64">
                    <iframe
                      src={contact.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Prathvi Group of College Location"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-3" id="enquiry-form">
              <EnquiryForm
                colleges={colleges}
                whatsappNumber={contact?.whatsappNumber || ""}
                whatsappGreeting={contact?.whatsappGreeting || ""}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
