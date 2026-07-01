ALTER TYPE "public"."submission_status" ADD VALUE 'approved';--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "result_token" text;--> statement-breakpoint
UPDATE "submissions" SET "result_token" = 'st_' || replace(gen_random_uuid()::text, '-', '') WHERE "result_token" IS NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "result_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "links_expire_at" timestamp with time zone;--> statement-breakpoint
UPDATE "submissions" SET "links_expire_at" = now() + interval '30 days' WHERE "links_expire_at" IS NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "links_expire_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_price_low" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_price_high" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_system" "finish_system";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_notes" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_notified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "customer_notified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "contractor_message_sid" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "customer_message_sid" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_result_token_unique" UNIQUE("result_token");