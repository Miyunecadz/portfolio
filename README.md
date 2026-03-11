# Portfolio CMS

A self-hosted portfolio and CMS built with Next.js 16. Manage projects, experience, and content through a private admin interface, while presenting a public-facing portfolio site backed by ISR-cached pages.

**Stack:** Next.js 16 · React 19 · TypeScript · Drizzle ORM · PostgreSQL (Supabase) · BetterAuth · Tailwind v4 · shadcn/ui · Groq

**Key features:**
- Public portfolio pages with ISR caching
- Password-protected admin CMS (no public sign-up)
- Project gallery with drag-and-drop screenshot management
- Rich-text editor (Tiptap) for project descriptions
- File uploads via Supabase Storage
- Contact form via Resend
- OAuth account connections (Google, GitHub, LinkedIn)
- "Ask JV" AI chat widget — floating chatbot backed by Groq LLM, speaks as your persona, rate-limited to 20 messages/day per IP

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (PostgreSQL + Storage)
- OAuth apps for Google, GitHub, and LinkedIn
- A [Groq](https://console.groq.com) API key (free tier, required for the AI chat widget)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in all required values in `.env.local`. See `.env.example` for descriptions of each variable.

### 3. Enable pgvector (Supabase only)

In the Supabase SQL editor, run once before the first migration:

```sql
create extension if not exists vector;
```

### 4. Run database migrations

```bash
npx drizzle-kit migrate
```

### 5. Generate BetterAuth tables

```bash
npx auth@latest generate
```

> Use `generate`, not `migrate` — BetterAuth manages its own schema separately.

### 6. Seed the admin account

```bash
npm run seed:credential
```

This creates the initial admin user using `ADMIN_EMAIL` from your `.env.local`.

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

---

## Dev Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx vitest` | Run all tests |
| `npx vitest run <path>` | Run a single test file |
| `npx drizzle-kit generate` | Generate migrations from schema changes |
| `npx drizzle-kit migrate` | Apply migrations (uses `DATABASE_URL_DIRECT`) |
| `npm run seed:credential` | Seed admin user |
| `npx auth@latest generate` | Regenerate BetterAuth schema |

---

## Project Structure

```
src/
  app/
    (public)/     # ISR-cached portfolio pages
    (admin)/      # CMS, guarded by proxy.ts
  actions/        # Server actions (mutations)
  db/schema/      # Drizzle schema definitions
  lib/
    queries/      # Shared data-fetching functions
    auth.ts       # BetterAuth config
    env.ts        # Type-safe env validation
    supabase.ts   # Supabase server client
  components/
    ui/           # shadcn/ui primitives
proxy.ts          # Edge-compatible route guard (replaces middleware.ts)
```
