"use client"

import { authClient } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = (provider: "google" | "github" | "linkedin") => {
    authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    })
  }

  const handleCredentialSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      })
      if (signInError) {
        setError("Invalid email or password.")
      }
    } catch {
      setError("Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-8">
        <h1 className="text-2xl font-bold text-center">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in with your authorized account to access the admin dashboard.
        </p>

        <form onSubmit={handleCredentialSignIn} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleSignIn("google")}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleSignIn("github")}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Continue with GitHub
          </button>
          <button
            onClick={() => handleSignIn("linkedin")}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Continue with LinkedIn
          </button>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
