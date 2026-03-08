// NOTE: Do NOT import server-only — this runs in Server Action context
import { Html, Head, Body, Container, Heading, Text, Section, Hr } from "@react-email/components"

interface ContactNotificationProps {
  name: string
  email: string
  subject?: string
  message: string
  budgetRange?: string
  projectType?: string
}

export function ContactNotification({
  name,
  email,
  subject,
  message,
  budgetRange,
  projectType,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <Heading style={{ fontSize: 24, marginBottom: 8 }}>New Contact Message</Heading>
          <Text>
            <strong>From:</strong> {name} ({email})
          </Text>
          {subject && (
            <Text>
              <strong>Subject:</strong> {subject}
            </Text>
          )}
          {budgetRange && (
            <Text>
              <strong>Budget:</strong> {budgetRange}
            </Text>
          )}
          {projectType && (
            <Text>
              <strong>Project Type:</strong> {projectType}
            </Text>
          )}
          <Hr />
          <Section>
            <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
          </Section>
          <Hr />
          <Text style={{ color: "#666", fontSize: 12 }}>
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
