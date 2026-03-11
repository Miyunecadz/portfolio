"use server"

import { cookies, headers } from "next/headers"
import { revalidateTag, revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/db"
import { siteSettings } from "@/db/schema/app"
import { type ActionResult } from "@/schemas/content"
import { auth } from "@/lib/auth"

export async function updateMaintenanceMode(
  enabled: boolean
): Promise<ActionResult<void>> {
  try {
    await db
      .insert(siteSettings)
      .values({ id: 1, maintenanceMode: enabled, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { maintenanceMode: enabled, updatedAt: new Date() },
      })

    const cookieStore = await cookies()
    if (enabled) {
      cookieStore.set("maintenance-mode", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      })
    } else {
      cookieStore.delete("maintenance-mode")
    }

    revalidatePath("/admin/settings")
    return { success: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return { success: false, error: message }
  }
}

export async function updatePersonaPrompt(data: {
  personaPrompt: string
}): Promise<ActionResult<void>> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: "Unauthorized" }

  const schema = z.object({ personaPrompt: z.string().max(10000) })
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    await db
      .insert(siteSettings)
      .values({ id: 1, personaPrompt: parsed.data.personaPrompt, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { personaPrompt: parsed.data.personaPrompt, updatedAt: new Date() },
      })

    revalidateTag("site-settings", "default")
    revalidatePath("/admin/settings")
    return { success: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return { success: false, error: message }
  }
}

export async function updateCalendlySettings(data: {
  calendlyEnabled: boolean
  calendlyUrl: string | null
}): Promise<ActionResult<void>> {
  try {
    if (data.calendlyEnabled && !data.calendlyUrl) {
      return {
        success: false,
        error: "Calendly URL is required when booking widget is enabled.",
      }
    }

    await db
      .insert(siteSettings)
      .values({
        id: 1,
        calendlyEnabled: data.calendlyEnabled,
        calendlyUrl: data.calendlyUrl ?? null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          calendlyEnabled: data.calendlyEnabled,
          calendlyUrl: data.calendlyUrl ?? null,
          updatedAt: new Date(),
        },
      })

    revalidatePath("/admin/settings")
    return { success: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return { success: false, error: message }
  }
}
