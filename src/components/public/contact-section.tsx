"use client"

import { ContactForm } from "@/components/public/contact-form"
import { CalendlyWidget } from "@/components/public/calendly-widget"

interface ContactSectionProps {
  contactFormEnabled: boolean
  calendlyEnabled: boolean
  calendlyUrl: string | null
}

export function ContactSection({
  contactFormEnabled,
  calendlyEnabled,
  calendlyUrl,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Get in Touch</h2>
        <p className="text-muted-foreground mb-8">
          Have a project in mind or want to chat? I&apos;d love to hear from you.
        </p>

        {contactFormEnabled ? (
          <ContactForm />
        ) : (
          <p className="text-muted-foreground italic">Contact form is currently disabled.</p>
        )}

        {calendlyEnabled && calendlyUrl && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Schedule a Call</h3>
            <CalendlyWidget url={calendlyUrl} />
          </div>
        )}
      </div>
    </section>
  )
}
