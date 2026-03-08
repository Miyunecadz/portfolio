ALTER TABLE "site_settings" ADD COLUMN "section_ordering" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "preview_token" text;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "preview_token_expiry" timestamp;