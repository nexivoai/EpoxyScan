CREATE TYPE "public"."crack_severity" AS ENUM('none', 'minor', 'moderate', 'major');--> statement-breakpoint
CREATE TYPE "public"."image_quality" AS ENUM('good', 'fair', 'poor');--> statement-breakpoint
CREATE TYPE "public"."prep_complexity" AS ENUM('standard', 'moderate', 'heavy');--> statement-breakpoint
CREATE TYPE "public"."price_block_reason" AS ENUM('commercial', 'polyaspartic', 'major_crack', 'insufficient_data');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('garage', 'basement', 'commercial', 'other');--> statement-breakpoint
CREATE TYPE "public"."sqft_source" AS ENUM('customer', 'ai_midpoint');--> statement-breakpoint
CREATE TYPE "public"."verification_reason" AS ENUM('low_confidence', 'poor_image_quality');--> statement-breakpoint
ALTER TYPE "public"."submission_status" ADD VALUE 'processing';--> statement-breakpoint
ALTER TYPE "public"."submission_status" ADD VALUE 'ai_complete';--> statement-breakpoint
ALTER TYPE "public"."submission_status" ADD VALUE 'ai_failed';--> statement-breakpoint
ALTER TYPE "public"."submission_status" ADD VALUE 'inspection_required';--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "attempt_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "processing_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_project_type" "project_type";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_sqft_low" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_sqft_high" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_crack_severity" "crack_severity";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_recommended_system" "finish_system";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_complexity" "prep_complexity";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_image_quality" "image_quality";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_confidence" numeric(4, 3);--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_surface_flags" jsonb;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_raw" jsonb;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_error" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "price_low" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "price_high" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "sqft_used" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "sqft_source" "sqft_source";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "prep_multiplier" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "price_block_reason" "price_block_reason";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "needs_verification" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "verification_reason" "verification_reason";