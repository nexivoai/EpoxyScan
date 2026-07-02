# EpoxyScan AI

Photo-based lead intake and preliminary epoxy-floor estimates, confirmed by a
contractor. Customers upload floor photos → AI assessment → pricing engine →
contractor review/approval → customer gets the estimate by SMS.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

The server validates environment variables at startup (`src/instrumentation.ts`)
and fails immediately with a list of what is missing or malformed.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | always | Neon Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | always | Vercel Blob read/write token |
| `OPENAI_API_KEY` | always | OpenAI Vision access |
| `OPENAI_MODEL` | optional | Vision model (defaults to `gpt-4o-mini`) |
| `CONTRACTOR_PHONE` | always | Where new-lead SMS is sent (E.164, e.g. `+15551234567`) |
| `APP_BASE_URL` | always | Public base URL used to build review/result links |
| `SMS_MODE` | optional | `sandbox` (logs only, default) or `live` (sends via Twilio) |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | when `SMS_MODE=live` | Twilio credentials |
| `CRON_SECRET` | for cron | Bearer token guarding `/api/cron/process` |

## Common changes

- **Change the contractor phone number:** update `CONTRACTOR_PHONE` in
  Vercel → Project → Settings → Environment Variables, then redeploy. No code change.
- **Change a rate, minimum, or prep multiplier:** edit `src/constants/rate-card.ts`
  (single source of truth), commit, and push — Vercel redeploys. The change is
  reflected everywhere the rate is consumed (pricing, UI, SMS).
- **Change the liability / disclaimer copy:** edit `src/constants/liability.ts`
  (single source, used at intake consent, the contractor review page, the customer
  SMS, and the customer result page).
- **Turn on real SMS:** set `SMS_MODE=live` and the three `TWILIO_*` variables.
- **Adjust AI thresholds or guardrails:** confidence/quality thresholds and retry
  counts live in `src/constants/ai.ts`; the prompt and guardrails live in
  `src/lib/ai/prompt.ts`.

## Where things live

| Concern | Location |
| --- | --- |
| Rate card (rates, minimums, prep multipliers) | `src/constants/rate-card.ts` |
| Pricing engine | `src/lib/pricing/` |
| AI prompt + guardrails | `src/lib/ai/prompt.ts`, `src/lib/ai/schema.ts` |
| SMS copy + message builders | `src/constants/sms.ts`, `src/lib/sms/messages.ts` |
| Liability copy | `src/constants/liability.ts` |
| Photo limits / upload rules | `src/constants/upload.ts`, `src/features/estimate/constants.ts` |
| Config + env schema | `src/lib/config/`, `src/lib/config/env.ts` |
| Database schema + migrations | `src/lib/db/schema.ts`, `drizzle/` |

## Scripts

```bash
npm run dev         # local dev server
npm run build       # production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run db:generate # generate a migration from schema changes
npm run db:migrate  # apply migrations
npm run db:studio   # drizzle studio
npm run smoke       # verify Postgres insert/select + a Blob upload against real env
```

## Background processing

New submissions are analyzed in the background right after intake. A daily Vercel
cron (`vercel.json` → `/api/cron/process`) sweeps for stuck or failed submissions:
it re-queues transient failures, retries them, and — once retries are exhausted —
texts the contractor a link so the lead can be priced and approved manually.

## Known limits

- The cron sweep runs **daily** (Vercel Hobby cron limit). Recovery and
  failure alerts for a stuck lead are only as timely as that interval — raise the
  `vercel.json` schedule (e.g. `*/15 * * * *`) on a Pro plan for faster recovery.
- The Blob upload endpoint (`/api/blob/upload`) is unauthenticated by design of the
  client-upload flow; add rate limiting before exposing the form to heavy public traffic.
- Review/result links expire after `LINK_TTL_DAYS` (30) — see `src/constants/app-defaults.ts`.
- SMS defaults to `sandbox`; no messages are sent until `SMS_MODE=live`.
