import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { contactSubmissions } from "@/db/schema/app"
import { Toaster } from "sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { MobileBottomNav } from "@/components/admin/mobile-bottom-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const [{ value: unreadCount }] = await db
    .select({ value: sql<number>`cast(count(*) as integer)` })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.status, "unread"))

  const user = {
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} unreadCount={unreadCount} />
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">{children}</main>
        <MobileBottomNav />
      </div>
      <Toaster richColors />
    </SidebarProvider>
  )
}
