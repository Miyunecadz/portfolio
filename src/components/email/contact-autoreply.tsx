import { Html, Head, Body, Container, Heading, Text } from "@react-email/components"

interface ContactAutoreplyProps {
  name: string
}

export function ContactAutoreply({ name }: ContactAutoreplyProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <Heading style={{ fontSize: 24 }}>Thanks for reaching out, {name}!</Heading>
          <Text>
            I&apos;ve received your message and will get back to you within 1-2 business days.
          </Text>
          <Text>
            If your inquiry is urgent, feel free to connect with me on LinkedIn.
          </Text>
          <Text style={{ color: "#666", fontSize: 12, marginTop: 32 }}>
            You&apos;re receiving this because you submitted the contact form on my portfolio.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
