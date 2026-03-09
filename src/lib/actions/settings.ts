"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { siteSettings } from "@/db/schema/app"
import { type ActionResult } from "@/schemas/content"

export async function updateMaintenanceMode(
  enabled: boolean
): Promise<ActionResult<void>> {
  try {
    await db
      .update(siteSettings)
      .set({ maintenanceMode: enabled, updatedAt: new Date() })
      .where(eq(siteSettings.id, 1))

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
      .update(siteSettings)
      .set({
        calendlyEnabled: data.calendlyEnabled,
        calendlyUrl: data.calendlyUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1))

    revalidatePath("/admin/settings")
    return { success: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return { success: false, error: message }
  }
}
