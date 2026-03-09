// Wave 0 stub — Wave 2 (07-02) will implement these queries.
// These exports exist so test imports resolve; all functions throw until implemented.

export async function getSiteSettingsAdmin(): Promise<{
  maintenanceMessage: string | null
  siteTitle: string
  maintenanceMode: boolean
  calendlyEnabled: boolean
  calendlyUrl: string | null
}> {
  throw new Error("getSiteSettingsAdmin not yet implemented — Wave 2 pending")
}
