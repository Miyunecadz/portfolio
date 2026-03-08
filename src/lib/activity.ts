import { db } from "@/db"
import { activityLog } from "@/db/schema/app"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// Call inside Server Actions only — requires active request context for headers().
export async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  description: string
): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    await db.insert(activityLog).values({
      userId: session?.user.id ?? null,
      action,
      entityType,
      entityId,
      description,
    })
  } catch {
    // Activity logging is non-critical — never fail a mutation because of it
    console.error("logActivity failed", { action, entityType, entityId })
  }
}
