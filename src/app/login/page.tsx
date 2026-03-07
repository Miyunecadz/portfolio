"use client"

import { authClient } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"

  const handleSignIn = (provider: "google" | "github" | "linkedin") => {
    authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-8">
        <h1 className="text-2xl font-bold text-center">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in with your authorized account to access the admin dashboard.
        </p>
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
