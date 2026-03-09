"use server"

// Wave 0 stub — Wave 2 (07-02) will implement these actions.
// These exports exist so test imports resolve; all functions throw until implemented.

import { type ActionResult } from "@/schemas/content"

export async function updateMaintenanceMode(
  _enabled: boolean
): Promise<ActionResult<void>> {
  throw new Error("updateMaintenanceMode not yet implemented — Wave 2 pending")
}

export async function updateCalendlySettings(_data: {
  calendlyEnabled: boolean
  calendlyUrl: string | null
}): Promise<ActionResult<void>> {
  throw new Error("updateCalendlySettings not yet implemented — Wave 2 pending")
}
