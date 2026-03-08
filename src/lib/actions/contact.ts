"use server"
import { headers } from "next/headers"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"
import { contactSchema } from "@/lib/validations/contact"
import { db } from "@/db"
import { contactSubmissions } from "@/db/schema/app"
import { env } from "@/lib/env"
import { ContactNotification } from "@/components/email/contact-notification"
import { ContactAutoreply } from "@/components/email/contact-autoreply"

const resend = new Resend(env.RESEND_API_KEY)

export type ContactFormResult = { success: true } | { error: string }

export async function submitContactForm(formData: unknown): Promise<ContactFormResult> {
  // 1. Rate limit check
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  if (rateLimit(ip)) {
    return { error: "Too many submissions. Please wait before trying again." }
  }

  // 2. Validate
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" }
  }

  const { name, email, subject, message, budgetRange, projectType } = parsed.data

  // 3. Save to DB
  await db.insert(contactSubmissions).values({
    name,
    email,
    subject,
    message,
    budgetRange,
    projectType,
    status: "unread",
    ipAddress: ip,
  })

  // 4. Send emails (parallel, don't block on delivery failure)
  const fromNotification = `Portfolio <notifications@${env.RESEND_FROM_DOMAIN}>`
  const fromAutoreply = `Portfolio <noreply@${env.RESEND_FROM_DOMAIN}>`
  const adminEmail = env.ADMIN_EMAIL.split(",")[0].trim()

  await Promise.allSettled([
    resend.emails.send({
      from: fromNotification,
      to: [adminEmail],
      replyTo: email,
      subject: `New contact: ${subject ?? "(no subject)"}`,
      react: ContactNotification({ name, email, subject, message, budgetRange, projectType }),
    }),
    resend.emails.send({
      from: fromAutoreply,
      to: [email],
      subject: "Thanks for reaching out",
      react: ContactAutoreply({ name }),
    }),
  ])

  return { success: true }
}
