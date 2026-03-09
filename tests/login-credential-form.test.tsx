// Wave 0 scaffold — AUTH-05
// Tests describe the credential form that Wave 2 will add to src/app/login/page.tsx.
// All assertions will FAIL until Wave 2 lands. That is intentional.

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Suspense } from "react"

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
      email: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}))

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => "/admin" }),
}))

// Dynamic import so a missing module doesn't crash the whole suite
let LoginPage: React.ComponentType | null = null

beforeAll(async () => {
  try {
    const mod = await import("../src/app/login/page")
    LoginPage = mod.default
  } catch {
    // Not yet modified — Wave 0 expects this
    LoginPage = null
  }
})

function renderLoginPage() {
  if (!LoginPage) throw new Error("LoginPage not available")
  return render(
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  )
}

describe("LoginPage — credential form (AUTH-05)", () => {
  it("renders email input field", async () => {
    renderLoginPage()
    // Wave 2 will add an email field above the OAuth buttons
    const emailInput =
      screen.queryByLabelText(/email/i) ??
      screen.queryByPlaceholderText(/email/i) ??
      screen.queryByRole("textbox", { name: /email/i })
    expect(emailInput).not.toBeNull()
  })

  it("renders password input field", async () => {
    renderLoginPage()
    // Wave 2 will add a password field
    const passwordInput =
      screen.queryByLabelText(/password/i) ??
      document.querySelector("input[type='password']")
    expect(passwordInput).not.toBeNull()
  })

  it("renders sign in button", async () => {
    renderLoginPage()
    // Wave 2 will add a credential sign-in submit button
    const signInButton = screen.queryByRole("button", { name: /sign in/i })
    expect(signInButton).not.toBeNull()
  })

  it("renders OAuth buttons below a divider", async () => {
    renderLoginPage()
    // Existing OAuth buttons must remain present after the credential form is added
    const googleButton = screen.queryByRole("button", { name: /google/i })
    expect(googleButton).not.toBeNull()
  })

  it("shows error message on failed sign-in", async () => {
    const { authClient } = await import("../src/lib/auth-client")
    vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid credentials" },
    } as never)

    renderLoginPage()

    const emailInput =
      screen.queryByLabelText(/email/i) ??
      screen.queryByPlaceholderText(/email/i)
    const passwordInput = document.querySelector("input[type='password']")
    const signInButton = screen.queryByRole("button", { name: /sign in/i })

    if (!emailInput || !passwordInput || !signInButton) {
      throw new Error("Credential form elements not found — Wave 2 not yet implemented")
    }

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      const errorEl =
        screen.queryByText(/invalid/i) ??
        screen.queryByText(/invalid credentials/i)
      expect(errorEl).not.toBeNull()
    })
  })
})
