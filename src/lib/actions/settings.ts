"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { siteSettings } from "@/db/schema/app"
import { type ActionResult } from "@/schemas/content"

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
