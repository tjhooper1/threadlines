# Tech Stack & Architecture Decisions

## Stack Overview

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server components, API routes, ISR, great DX, Vercel deploy |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system, accessible components |
| **Database** | PostgreSQL via Supabase | Relational data model fits the domain, Supabase adds auth + storage + realtime |
| **ORM** | Drizzle ORM | Type-safe, lightweight, great with Supabase Postgres |
| **Auth** | Supabase Auth | Email/password to start, OAuth later, RLS integration |
| **File Storage** | Supabase Storage | S3-backed, integrated with auth, handles photos/videos/docs |
| **AI** | OpenAI API (GPT-4) | Life summary generation, reflection prompts, pattern detection |
| **Hosting** | Vercel | Zero-config Next.js deploys, edge functions, preview deploys |
| **Package Manager** | pnpm | Fast, disk-efficient |
| **Validation** | Zod | Runtime validation + TypeScript inference |
| **State Management** | React Server Components + `nuqs` for URL state | Minimal client state; server-first architecture |
| **Date Handling** | date-fns | Lightweight, tree-shakeable |
| **Charts** | Recharts or Nivo | For personality timelines and life stats visualizations |

---

## Project Structure (Planned)

```
life-app/
├── docs/                       # Planning documents (this folder)
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Landing page, login, signup (public)
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/              # Authenticated app shell
│   │   │   ├── layout.tsx      # App shell with sidebar nav
│   │   │   ├── dashboard/
│   │   │   ├── timeline/
│   │   │   ├── eras/
│   │   │   ├── events/
│   │   │   ├── identity/
│   │   │   ├── personality/
│   │   │   ├── artifacts/
│   │   │   ├── influences/
│   │   │   ├── stats/
│   │   │   ├── summary/
│   │   │   └── settings/
│   │   ├── api/                # API routes
│   │   │   ├── events/
│   │   │   ├── eras/
│   │   │   ├── artifacts/
│   │   │   ├── identity/
│   │   │   ├── ai/
│   │   │   └── auth/
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── timeline/           # Timeline-specific components
│   │   ├── events/             # Event card components
│   │   ├── eras/               # Era components
│   │   └── layout/             # App shell, sidebar, nav
│   ├── lib/
│   │   ├── db/                 # Drizzle schema, client, migrations
│   │   │   ├── schema.ts
│   │   │   ├── index.ts
│   │   │   └── migrations/
│   │   ├── supabase/           # Supabase client helpers
│   │   ├── ai/                 # OpenAI integration
│   │   ├── utils.ts            # General utilities
│   │   └── validators.ts       # Zod schemas
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # Shared TypeScript types
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local                  # Environment variables (not committed)
```

---

## Key Architecture Decisions

### 1. Server-first with React Server Components

Most pages fetch data on the server. Client components only where interactivity is needed (timeline interactions, forms, modals). This keeps the app fast and reduces client bundle size.

### 2. Supabase for the backend layer

Rather than building a custom backend, Supabase provides:
- PostgreSQL database with direct access
- Row Level Security (RLS) for data isolation per user
- Auth with session management
- File storage for artifacts
- Realtime subscriptions (future: collaborative features)

### 3. Drizzle ORM over Prisma

Drizzle is lighter, faster, and produces cleaner SQL. Better fit for a project where we want fine control over queries (especially for the timeline with its multi-layer filtering).

### 4. Route Groups for public vs. authenticated

`(marketing)` group handles the public-facing pages. `(app)` group is behind auth middleware and shares the app layout (sidebar, navigation).

### 5. API routes for mutations, server components for reads

- **Reads:** Server components fetch directly from the database
- **Writes:** API routes handle mutations with Zod validation
- **AI:** Dedicated API routes for OpenAI calls (streaming responses)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Supabase Postgres direct connection)
DATABASE_URL=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Workflow

- **Local dev:** `pnpm dev` — runs Next.js dev server
- **Database:** Supabase local dev via `supabase start` or remote project
- **Migrations:** Drizzle Kit — `pnpm db:generate` and `pnpm db:push`
- **Type checking:** `pnpm type-check`
- **Linting:** ESLint with Next.js config
- **Formatting:** Prettier
