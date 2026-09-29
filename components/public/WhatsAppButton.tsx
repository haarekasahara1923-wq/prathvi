"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { whatsappEnquirySchema } from "@/lib/validators";
import { buildEnquiryMessage } from "@/lib/whatsapp";
import toast from "react-hot-toast";
import type { z } from "zod";

type WhatsAppFormData = z.infer<typeof whatsappEnquirySchema>;

interface College {
  id: string;
  name: string;
  courses: { id: string; name: string }[];
}

interface WhatsAppButtonProps {
  whatsappNumber: string;
  whatsappGreeting?: string;
  colleges: College[];
  defaultCollege?: string;
  defaultCourse?: string;
}

export default function WhatsAppButton({
  whatsappNumber,
  whatsappGreeting,
  colleges,
  defaultCollege,
  defaultCourse,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState(defaultCollege || "");

  if (!whatsappNumber) return null;

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId);
  const availableCourses = selectedCollege?.courses || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappEnquirySchema),
    defaultValues: {
      collegeId: defaultCollege,
      courseId: defaultCourse,
    },
  });

  const watchedCollege = watch("collegeId");

  useEffect(() => {
    setSelectedCollegeId(watchedCollege || "");
    if (watchedCollege !== selectedCollegeId) {
      setValue("courseId", "");
    }
  }, [watchedCollege]);

  const onSubmit = async (data: WhatsAppFormData) => {
    setIsSubmitting(true);
    try {
      const college = colleges.find((c) => c.id === data.collegeId);
      const course = college?.courses.find((c) => c.id === data.courseId);

      // Save to DB
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          message: data.message || whatsappGreeting || "WhatsApp enquiry",
          collegeId: data.collegeId,
          courseId: data.courseId,
          source: "WHATSAPP",
          honeypot: data.honeypot,
        }),
      });

      const message = buildEnquiryMessage({
        name: data.name,
        mobile: data.phone,
        college: college?.name,
        course: course?.name,
        message: data.message,
        greeting:
          whatsappGreeting ||
          "Hello Prathvi Group of College! I would like to enquire about admissions.",
      });

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );

      reset();
      setIsOpen(false);
      toast.success("Opening WhatsApp...");
    } catch (error) {
      toast.error("Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectChat = () => {
    const message =
      whatsappGreeting ||
      "Hello Prathvi Group of College! I would like to know more about your courses and admissions.";
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative group"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
                <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" />
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl whatsapp-pulse transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: "#25D366" }}
                aria-label="Open WhatsApp Chat"
                id="whatsapp-floating-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  width="28"
                  height="28"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ width: "320px", maxHeight: "80vh", overflowY: "auto" }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: "#25D366" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Quick Enquiry</p>
                    <p className="text-green-100 text-xs">Prathvi Group of College</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Close WhatsApp chat"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
                <div>
                  <input
                    {...register("name")}
                    placeholder="Your Name *"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    id="wa-name"
                    aria-label="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("phone")}
                    placeholder="Mobile Number *"
                    maxLength={10}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    id="wa-phone"
                    aria-label="Mobile number"
                    inputMode="numeric"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {colleges.length > 0 && (
                  <div>
                    <select
                      {...register("collegeId")}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                      id="wa-college"
                      aria-label="Select college"
                    >
                      <option value="">Select College (Optional)</option>
                      {colleges.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {availableCourses.length > 0 && (
                  <div>
                    <select
                      {...register("courseId")}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                      id="wa-course"
                      aria-label="Select course"
                    >
                      <option value="">Select Course (Optional)</option>
                      {availableCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <textarea
                    {...register("message")}
                    placeholder="Message (Optional)"
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                    id="wa-message"
                    aria-label="Message"
                  />
                </div>

                {/* Honeypot */}
                <input
                  {...register("honeypot")}
                  type="text"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ display: "none" }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ backgroundColor: isSubmitting ? "#9CA3AF" : "#25D366" }}
                  id="wa-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      Send on WhatsApp
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectChat}
                  className="w-full text-center text-xs text-gray-400 hover:text-green-600 transition-colors py-1"
                >
                  Skip form, chat directly →
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
