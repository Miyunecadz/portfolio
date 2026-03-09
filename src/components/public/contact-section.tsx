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
    <div className="flex flex-col gap-12">
      <div className="max-w-2xl mx-auto w-full px-4">
        {contactFormEnabled ? (
          <ContactForm />
        ) : (
          <p className="text-muted-foreground italic">Contact form is currently disabled.</p>
        )}
      </div>

      {calendlyEnabled && calendlyUrl && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Schedule a Call</h3>
          <div className="calendly-container">
            <CalendlyWidget url={calendlyUrl} />
          </div>
        </div>
      )}
    </div>
  )
}
