CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"google_analytics_id" text,
	"site_title" varchar(60),
	"site_tagline" varchar(160),
	"contact_form_enabled" boolean DEFAULT true NOT NULL,
	"calendly_enabled" boolean DEFAULT false NOT NULL,
	"calendly_url" text,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"robots_content" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
