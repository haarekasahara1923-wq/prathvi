import { z } from "zod";

export const indianMobileRegex = /^[6-9]\d{9}$/;

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(indianMobileRegex, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  collegeId: z.string().optional(),
  courseId: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export const whatsappEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(indianMobileRegex, "Please enter a valid 10-digit Indian mobile number"),
  collegeId: z.string().optional(),
  courseId: z.string().optional(),
  message: z.string().max(500).optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const collegeSchema = z.object({
  name: z.string().min(2, "College name required").max(200),
  description: z.string().min(10, "Description required").max(2000),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  address: z.string().max(500).optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const courseSchema = z.object({
  collegeId: z.string().min(1, "College required"),
  name: z.string().min(2, "Course name required").max(200),
  duration: z.string().min(1, "Duration required").max(100),
  description: z.string().max(1000).optional(),
  eligibility: z.string().max(500).optional(),
  order: z.number().int().default(0),
});

export const aboutSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  vision: z.string().min(10).max(2000),
  mission: z.string().min(10).max(2000),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export const contactSchema = z.object({
  address: z.string().min(5).max(500),
  phones: z.array(z.string().min(1)).min(1, "At least one phone required"),
  emails: z.array(z.string().email()).min(1, "At least one email required"),
  whatsappNumber: z.string().max(20).optional().or(z.literal("")),
  whatsappGreeting: z.string().max(500).optional(),
  workingHours: z.string().max(200).optional(),
  mapEmbedUrl: z.string().max(2000).optional(),
  facebook: z.string().max(200).optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  youtube: z.string().max(200).optional().or(z.literal("")),
  twitter: z.string().max(200).optional().or(z.literal("")),
  linkedin: z.string().max(200).optional().or(z.literal("")),
});

export const galleryItemSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().min(1, "URL required"),
  publicId: z.string().optional(),
  youtubeUrl: z.string().optional(),
  title: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  order: z.number().int().default(0),
});
