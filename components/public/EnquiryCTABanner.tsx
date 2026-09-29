import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export default function EnquiryCTABanner() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f2240 100%)",
      }}
    >
      {/* Decorative element */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          transform: "translate(50%, -50%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          transform: "translate(-50%, 50%)",
        }}
      />

      <div className="container-custom relative z-10 text-center">
        <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
          Start Your Journey
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Shape Your Future?
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of students who have built successful careers through
          Prathvi Group of College. Admissions are open now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact#enquiry-form" className="btn-accent text-base px-8 py-3">
            <ArrowRight size={20} />
            Apply for Admission
          </Link>
          <a href="tel:+919826000001" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white text-base px-8 py-3">
            <Phone size={18} />
            Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
