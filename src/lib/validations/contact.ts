import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(5000),
  budgetRange: z.string().max(50).optional(),
  projectType: z.string().max(50).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
