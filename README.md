# Threadline

**A living autobiography with intelligence.**

Threadline turns a person's life into a structured, explorable identity map — not just a journal with a timeline, but a tool that helps you understand your past, see your present clearly, and build your future more intentionally.

---

## What is Threadline?

Most apps store moments. Threadline explains a life.

It captures not just **what happened**, but **what it meant**, **how it changed you**, **what patterns keep repeating**, and **what future paths seem likely**. It's a private life OS — a digital self-portrait across time.

## Core Concepts

- **Eras & Chapters** — Organize life into named seasons, not just calendar years
- **Layered Timeline** — Events, identity phases, interests, emotions, and environment all visualized together
- **Key Event Cards** — What happened, how it affected you, what belief it created, what it changed later
- **Identity Evolution** — "Who I was / Who I am / Who I'm becoming"
- **Personality Over Time** — Values, confidence, motivations, and patterns tracked as a timeline, not a static label
- **Relationship Map** — People who shaped you, when they entered your life, and how they influenced you
- **Theme Detection** — AI-powered recognition of recurring life patterns
- **Artifacts & Evidence** — Photos, voice notes, playlists, old posts — make the story feel real
- **Letters Across Time** — Write to your past or future self
- **Legacy Mode** — Export to book, documentary-style site, or family archive

## Social Philosophy

Threadline is **private-first**. Reflection before performance.

Social features are layered in carefully:

1. Private autobiography tool
2. Family/couple sharing
3. Collaborative memory contributions
4. Curated public profiles
5. Small reflection communities ("Circles")

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **AI:** OpenAI API
- **Hosting:** Vercel

## Project Status

� **Phase 2 complete** — Working on Phase 3.

See [`/docs`](./docs) for detailed planning documents.

### Completed

- **Phase 0 — Project Setup:** Next.js 16 + TypeScript + Tailwind + shadcn/ui + Supabase Auth + Drizzle ORM + full database schema
- **Phase 1 — Core Data Entry:** Eras & Events CRUD, quick-add flow, era linking, tags, date precision, dashboard with live data
- **Phase 2 — Timeline:** Horizontal scrollable timeline with column-based layout, layer system (5 layers with color coding), era bars, zoom levels (decade/year/month), layer & era filtering, click-to-expand event detail sheet

## Getting Started

```bash
pnpm install
cp .env.local.example .env.local  # fill in Supabase credentials
pnpm dev
```

## License

Private — not open source at this time.
