"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validators";
import { buildEnquiryMessage } from "@/lib/whatsapp";
import toast from "react-hot-toast";
import { Send, MessageSquare, CheckCircle } from "lucide-react";

interface College {
  id: string;
  name: string;
  courses: { id: string; name: string }[];
}

interface EnquiryFormProps {
  colleges: College[];
  whatsappNumber: string;
  whatsappGreeting: string;
}

export default function EnquiryForm({
  colleges,
  whatsappNumber,
  whatsappGreeting,
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    getValues,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const watchedCollege = watch("collegeId");

  useEffect(() => {
    setSelectedCollegeId(watchedCollege || "");
    setValue("courseId", "");
  }, [watchedCollege, setValue]);

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId);
  const availableCourses = selectedCollege?.courses || [];

  const submitToAPI = async (data: EnquiryFormData, source: "FORM" | "WHATSAPP") => {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to submit enquiry");
    }

    return response.json();
  };

  const onSubmitForm = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      await submitToAPI(data, "FORM");
      setIsSuccess(true);
      reset();
      toast.success("Enquiry submitted successfully! We will contact you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitWhatsApp = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await submitToAPI(data, "WHATSAPP");

      const college = colleges.find((c) => c.id === data.collegeId);
      const course = college?.courses.find((c) => c.id === data.courseId);

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

      setIsSuccess(true);
      reset();
      toast.success("Enquiry saved! Opening WhatsApp...");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Thank You!</h3>
        <p className="text-slate-600 mb-6">
          Your enquiry has been submitted successfully. Our admissions team will
          contact you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-primary mx-auto"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-1 section-title">
        Send an Enquiry
      </h2>
      <p className="text-slate-500 text-sm mb-6 mt-4">
        Fill out the form below and our admissions team will get back to you.
      </p>

      <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
        {/* Honeypot */}
        <input
          {...register("honeypot")}
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label htmlFor="enquiry-name" className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              id="enquiry-name"
              type="text"
              placeholder="Enter your full name"
              className={inputClass}
              aria-describedby={errors.name ? "enquiry-name-error" : undefined}
            />
            {errors.name && (
              <p id="enquiry-name-error" className={errorClass} role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="enquiry-phone" className={labelClass}>
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              id="enquiry-phone"
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              inputMode="numeric"
              className={inputClass}
              aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
            />
            {errors.phone && (
              <p id="enquiry-phone-error" className={errorClass} role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="enquiry-email" className={labelClass}>
              Email Address{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              {...register("email")}
              id="enquiry-email"
              type="email"
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>

          {/* College */}
          {colleges.length > 0 && (
            <div>
              <label htmlFor="enquiry-college" className={labelClass}>
                College{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                {...register("collegeId")}
                id="enquiry-college"
                className={inputClass}
              >
                <option value="">Select a College</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Course */}
          <div>
            <label htmlFor="enquiry-course" className={labelClass}>
              Course{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              {...register("courseId")}
              id="enquiry-course"
              className={inputClass}
              disabled={availableCourses.length === 0}
            >
              <option value="">
                {availableCourses.length === 0
                  ? "Select a college first"
                  : "Select a Course"}
              </option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label htmlFor="enquiry-message" className={labelClass}>
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("message")}
              id="enquiry-message"
              rows={4}
              placeholder="Tell us about your interest, queries, or anything specific you'd like to know..."
              className={inputClass}
              aria-describedby={errors.message ? "enquiry-message-error" : undefined}
            />
            {errors.message && (
              <p id="enquiry-message-error" className={errorClass} role="alert">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            id="enquiry-submit-btn"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send size={16} />
                Submit Enquiry
              </>
            )}
          </button>

          {whatsappNumber && (
            <button
              type="button"
              onClick={onSubmitWhatsApp}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
              style={{
                background: isSubmitting ? "#9CA3AF" : "#25D366",
              }}
              id="enquiry-whatsapp-btn"
            >
              <MessageSquare size={16} />
              Send via WhatsApp
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">
          Your information is secure and will only be used for admission purposes.
        </p>
      </form>
    </div>
  );
}
