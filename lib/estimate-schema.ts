import { z } from "zod";

export const projectTypes = [
  "Bathroom",
  "Kitchen",
  "Basement",
  "Full Reno",
  "Flooring",
  "Roofing",
  "Custom Home",
  "Other",
] as const;

export const budgetRanges = [
  "Under $25,000",
  "$25,000 to $50,000",
  "$50,000 to $100,000",
  "$100,000 to $250,000",
  "$250,000+",
  "Not sure yet",
] as const;

export const timelines = [
  "As soon as possible",
  "1 to 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "Just exploring",
] as const;

export const contactMethods = ["Phone Call", "Text", "Email"] as const;

export const ATTACHMENTS = {
  maxCount: 8,
  maxBytesEach: 3 * 1024 * 1024,
  maxBytesTotal: 10 * 1024 * 1024,
} as const;

export const estimateSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(7, "Please enter your phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(200),
  location: z
    .string()
    .trim()
    .min(2, "Please enter your address or city")
    .max(200),
  projectType: z.enum(projectTypes, {
    message: "Please pick a project type",
  }),
  budget: z.string().max(60).optional().or(z.literal("")),
  timeline: z.string().max(60).optional().or(z.literal("")),
  message: z.string().max(4000).optional().or(z.literal("")),
  contactMethod: z.string().max(30).optional().or(z.literal("")),
  // Honeypot — humans never see or fill this.
  company: z.string().max(200).optional().or(z.literal("")),
});

export type EstimateInput = z.infer<typeof estimateSchema>;

export const estimateDefaults: Partial<EstimateInput> = {
  budget: "",
  timeline: "",
  message: "",
  contactMethod: "Phone Call",
  company: "",
};
