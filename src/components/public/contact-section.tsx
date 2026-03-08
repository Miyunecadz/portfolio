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
    <div>
      <div className="max-w-2xl mx-auto px-4">
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
    </div>
  )
}
