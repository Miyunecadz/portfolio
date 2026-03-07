# Portfolio CMS

## What This Is

A full-featured, self-managed portfolio and content management system built on Next.js 16 (App Router). It serves two audiences: the public who view the polished portfolio, and the admin (you) who manages all content through a protected dashboard. Built as a monorepo — no separate backend — everything deploys to Vercel as a single unit.

## Core Value

A live, deployed portfolio that proves you can build production-grade web applications — the portfolio itself is the work sample that lands freelance clients and job offers.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Admin dashboard with stats, activity feed, and quick actions
- [ ] Projects CRUD with GitHub sync (auto + manual)
- [ ] Experience CRUD with LinkedIn import
- [ ] Skills management with categories and proficiency levels
- [ ] References / Testimonials CRUD with LinkedIn import
- [ ] Education CRUD with LinkedIn import
- [ ] Profile management (bio, avatar, resume, social links, availability status)
- [ ] Appearance system — 4 templates, color/font customization, section ordering, dark mode, manual publish flow
- [ ] AI Chat widget — RAG-powered chatbot using portfolio data (floating widget + /chat page)
- [ ] Contact form + admin inbox + email notifications via Resend
- [ ] Booking widget toggle (Calendly / Cal.com embed)
- [ ] SEO — global + per-page meta, OG images, sitemap, robots.txt
- [ ] Google Analytics dashboard embedded in admin
- [ ] GitHub integration — OAuth, repo selection, daily cron sync
- [ ] LinkedIn integration — OAuth, import flow with human-in-the-loop review
- [ ] General settings — site config, maintenance mode, account management
- [ ] Media Library — centralized file management for all Supabase Storage uploads
- [ ] BetterAuth — admin-only login via Google, GitHub, LinkedIn OAuth
- [ ] CI/CD pipeline via GitHub Actions + Vercel auto-deploy

### Out of Scope

- Multi-user / team support — single admin only, no user roles needed
- Mobile app — web-first, portfolio is responsive but no native app
- Real-time collaboration — single admin, no concurrent editing
- Custom domain management — handled externally via Vercel dashboard
- Payment / billing — no monetization features

## Context

- **Solo project** — built by and for one developer as a personal branding tool
- **Audience** — potential employers and freelance clients in IT/web development
- **The meta-goal** — building this IS the proof of skill; the sophistication of the CMS is itself a portfolio piece
- **Stack is locked** — fully defined in `portfolio-cms-docs.docx`; no technology decisions needed
- **Coding standards** — Conventional Commits, kebab-case folders, PascalCase components, `ActionResult<T>` server actions, Drizzle `generate + migrate` in production

## Constraints

- **Tech Stack**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Supabase PostgreSQL + Storage + pgvector, BetterAuth, Vercel AI SDK, OpenAI GPT-4o, Resend, Vercel — locked, no substitutions
- **Auth**: Single admin user — BetterAuth handles OAuth via Google, GitHub, LinkedIn; all `/admin/*` routes protected by middleware
- **AI**: RAG pipeline uses OpenAI `text-embedding-3-small` for embeddings, `gpt-4o` for chat, pgvector for similarity search
- **Deployment**: Vercel (hosting + cron jobs), Supabase cloud (DB + storage), GitHub Actions (CI)
- **Done means**: Live, deployed site with a shareable URL suitable for a resume or LinkedIn profile

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js monorepo (no separate backend) | Simplifies deployment — single Vercel unit, no API server to manage | — Pending |
| BetterAuth over NextAuth | Newer, better DX, supports LinkedIn OAuth cleanly | — Pending |
| Drizzle ORM over Prisma | Lighter weight, better TypeScript inference, works well with Supabase direct connection | — Pending |
| OpenAI GPT-4o for AI Chat | Best quality for RAG chat responses; `text-embedding-3-small` for cost-efficient embeddings | — Pending |
| Manual publish flow for theme changes | Prevents accidental live changes — admin previews before going live | — Pending |
| Human-in-the-loop for LinkedIn imports | Prevents bad data from auto-saving; admin reviews every imported entry | — Pending |

---
*Last updated: 2026-03-07 after initialization*
