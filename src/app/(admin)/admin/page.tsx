import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {session.user.email}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Admin shell and stats coming in Phase 2.
      </p>
    </main>
  )
}
