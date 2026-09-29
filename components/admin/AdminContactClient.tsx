"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateContactDetails } from "@/actions/contact";

interface ContactData {
  address: string;
  phones: string[];
  emails: string[];
  whatsappNumber: string | null;
  whatsappGreeting: string | null;
  workingHours: string | null;
  mapEmbedUrl: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
  linkedin: string | null;
}

interface AdminContactClientProps {
  contact: ContactData | null;
}

const defaultForm = {
  address: "",
  phones: "",
  emails: "",
  whatsappNumber: "",
  whatsappGreeting: "",
  workingHours: "",
  mapEmbedUrl: "",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  linkedin: "",
};

export default function AdminContactClient({ contact }: AdminContactClientProps) {
  const [form, setForm] = useState({
    address: contact?.address || "",
    phones: contact?.phones?.join("\n") || "",
    emails: contact?.emails?.join("\n") || "",
    whatsappNumber: contact?.whatsappNumber || "",
    whatsappGreeting: contact?.whatsappGreeting || "",
    workingHours: contact?.workingHours || "",
    mapEmbedUrl: contact?.mapEmbedUrl || "",
    facebook: contact?.facebook || "",
    instagram: contact?.instagram || "",
    youtube: contact?.youtube || "",
    twitter: contact?.twitter || "",
    linkedin: contact?.linkedin || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      await updateContactDetails(fd);
      toast.success("Contact details updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
            Primary Contact Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Address *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Phone Numbers * <span className="text-xs text-slate-400 font-normal">(One per line)</span>
              </label>
              <textarea
                value={form.phones}
                onChange={(e) => setForm({ ...form, phones: e.target.value })}
                required
                rows={3}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Email Addresses * <span className="text-xs text-slate-400 font-normal">(One per line)</span>
              </label>
              <textarea
                value={form.emails}
                onChange={(e) => setForm({ ...form, emails: e.target.value })}
                required
                rows={3}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Working Hours</label>
              <input
                type="text"
                value={form.workingHours}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                placeholder="e.g. Monday - Saturday: 9:00 AM – 5:00 PM"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                Google Maps Embed URL
              </label>
              <textarea
                value={form.mapEmbedUrl}
                onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
                rows={3}
                placeholder="https://www.google.com/maps/embed?..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
            WhatsApp Integration
          </h3>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className={labelClass}>
                WhatsApp Number <span className="text-xs text-slate-400 font-normal">(Include country code without +, e.g., 919876543210)</span>
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="919826000001"
                className={inputClass}
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to hide the WhatsApp floating button on the website.
              </p>
            </div>
            <div>
              <label className={labelClass}>
                Default Greeting Message
              </label>
              <textarea
                value={form.whatsappGreeting}
                onChange={(e) => setForm({ ...form, whatsappGreeting: e.target.value })}
                rows={2}
                placeholder="Hello Prathvi Group of College! I would like to know more..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                Save Contact Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
