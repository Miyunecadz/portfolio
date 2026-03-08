// @ts-ignore — implementation pending
import { contactSchema } from "@/lib/validations/contact"

describe("contactSchema", () => {
  it("passes validation with a valid payload", () => {
    const result = contactSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "This is a test message.",
    })
    expect(result.success).toBe(true)
  })

  it("fails when name is missing", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "alice@example.com",
      message: "Test",
    })
    expect(result.success).toBe(false)
  })

  it("fails when email is missing", () => {
    const result = contactSchema.safeParse({
      name: "Alice",
      email: "",
      message: "Test",
    })
    expect(result.success).toBe(false)
  })

  it("fails when message is missing", () => {
    const result = contactSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      message: "",
    })
    expect(result.success).toBe(false)
  })

  it("fails with an invalid email format", () => {
    const result = contactSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      message: "Test",
    })
    expect(result.success).toBe(false)
  })
})
