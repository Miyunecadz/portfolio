import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {session?.user.email}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Dashboard stats and widgets coming in Phase 2.
      </p>
    </div>
  )
}
