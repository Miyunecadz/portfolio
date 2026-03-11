CREATE TABLE "ai_rate_limits" (
	"ip" text NOT NULL,
	"date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ai_rate_limits_ip_date_pk" PRIMARY KEY("ip","date")
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "persona_prompt" text;