CREATE TYPE "public"."finish_system" AS ENUM('flake', 'metallic', 'polyaspartic');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending_ai');--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"content_type" text NOT NULL,
	"bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"customer_sqft" integer,
	"requested_finish" "finish_system",
	"status" "submission_status" DEFAULT 'pending_ai' NOT NULL,
	"review_token" text NOT NULL,
	CONSTRAINT "submissions_review_token_unique" UNIQUE("review_token")
);
--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;