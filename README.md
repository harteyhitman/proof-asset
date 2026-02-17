# ProofAsset – SaaS Starter Kit

Production-ready starter for founders: Clerk auth, Stripe subscriptions, Supabase database, and a polished dashboard.

## Quick start (7 days)

### Day 1–2: Foundation

- [ ] Clone and run `npm install`
- [ ] Copy `.env.example` to `.env.local` and fill in keys
- [ ] Set up [Clerk](https://clerk.com): create app, add publishable/secret keys and webhook (see below)
- [ ] Set up [Supabase](https://supabase.com): create project, run migrations, add URL/anon key and service role key
- [ ] Run `npm run dev` and confirm app loads

### Day 3–4: Payments

- [ ] Create [Stripe](https://stripe.com) account and products (e.g. Basic $29, Pro $79)
- [ ] Add `STRIPE_BASIC_PRICE_ID` and `STRIPE_PRO_PRICE_ID` (and other Stripe keys) to `.env.local`
- [ ] For local webhooks: `npm run stripe:listen` (in a second terminal) and set `STRIPE_WEBHOOK_SECRET` from the CLI
- [ ] Test checkout: sign up → Pricing → Get Basic/Pro → complete test payment

### Day 5–6: Dashboard & polish

- [ ] In Clerk Dashboard, add webhook URL: `https://your-domain.com/api/webhooks/clerk` (or ngrok for local) and set `CLERK_WEBHOOK_SECRET`
- [ ] Optionally configure email (EMAIL_* in `.env.local`) for welcome and receipt emails
- [ ] Test full flow: sign up → dashboard → usage → pricing → subscribe

### Day 7: Ship

- [ ] Deploy (e.g. Vercel), add production env vars and production Stripe/Clerk webhook URLs
- [ ] Run through full user journey and fix any issues
- [ ] Record a short Loom walkthrough

## Environment setup

1. Copy `.env.example` to `.env.local`
2. Fill in all required keys (see file comments / docs for each service)
3. Run `npm install` and `npm run dev`

## Commands

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:setup` | Apply Supabase migrations (`supabase db push`) |
| `npm run db:seed` | Run seed script (optional) |
| `npm run stripe:listen` | Forward Stripe webhooks to localhost |
| `npm run stripe:trigger` | Trigger test Stripe events |

## Stripe webhook (local)

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run stripe:listen
# Set STRIPE_WEBHOOK_SECRET in .env.local from the CLI output
```

## Features

- **Auth:** Clerk (sign-in, sign-up, webhook sync to Supabase)
- **Payments:** Stripe Checkout and subscription webhooks
- **Database:** Supabase (users, subscriptions, usage_logs)
- **Dashboard:** Server-rendered dashboard with stats, usage chart, subscription card
- **Email:** Optional welcome and payment receipt emails (nodemailer)

## Project structure

- `src/app/` – Next.js App Router (landing, pricing, dashboard, auth, API routes)
- `src/app/api/` – Webhooks (Stripe, Clerk) and create-checkout
- `src/app/dashboard/` – Dashboard page and components
- `src/components/ui/` – Shared UI (e.g. Button)
- `src/lib/` – Supabase clients, Stripe, email, utils
- `supabase/migrations/` – SQL schema

## License

MIT
