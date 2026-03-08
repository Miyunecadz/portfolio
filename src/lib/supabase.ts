import { createClient } from "@supabase/supabase-js"

// Server-only: use service role to bypass RLS for Storage uploads in Server Actions.
// Never import this in client components — it exposes the service role key.
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
