# Development Roadmap

## Phase 0 — Project Setup ✅
> Foundation: scaffolding, tooling, database, auth

- [x] Initialize Next.js 16 with TypeScript, Tailwind, pnpm
- [x] Install and configure shadcn/ui
- [x] Set up Supabase project (local or remote)
- [x] Configure Drizzle ORM with Supabase Postgres
- [x] Define database schema and run initial migration
- [x] Implement Supabase Auth (signup, login, logout)
- [x] Create authenticated app layout (sidebar + nav)
- [x] Set up route groups: `(marketing)` and `(app)`
- [x] Configure environment variables and `.env.local`
- [x] Set up ESLint + Prettier

---

## Phase 1 — Core Data Entry ✅
> Let users start building their life story

- [x] **Eras:** CRUD for life eras (name, dates, summary, traits, lesson)
- [x] **Events:** CRUD for life events (all card fields)
- [x] **Event ↔ Era linking:** assign events to eras
- [x] **Quick-add event flow:** title + date + short note (minimal friction)
- [x] **Full event reflection mode:** all fields including impact, beliefs, downstream effects
- [x] **Tags system:** freeform tags on events, filterable
- [x] **Date flexibility:** support year-only, month-only, and exact dates

---

## Phase 2 — Timeline ✅
> The centerpiece visual experience

- [x] **Timeline view:** horizontal scrollable timeline of all events (column-based layout)
- [x] **Layer system:** toggle life events, identity, interests, emotions, environment
- [x] **Color coding:** by layer type (blue, purple, green, amber, teal)
- [x] **Era bars:** visual era spans on the timeline (absolute-positioned colored bands)
- [x] **Zoom levels:** decade → year → month
- [x] **Click-to-expand:** tap any event to see its full card (side sheet with all details)
- [x] **Filters:** by layer, era, undated event count indicator

---

## Phase 3 — Identity & Personality ✅
> Self-understanding features

- [x] **Identity screen:** "Who I Was / Am / Becoming" with three-column editable cards (amber/blue/emerald)
- [x] **Identity snapshots:** save and update versions, view snapshot history with timestamps
- [x] **Personality entries:** per-era entries on 7 dimensions (confidence, introversion, values, triggers, motivations, strengths, self-sabotage)
- [x] **Personality cards:** color-coded by dimension, grouped view, era linking, delete support
- [x] **Values tracker:** covered via personality entries with values dimension + era association

---

## Phase 4 — Artifacts & Influences ✅
> Make it real and tangible

- [x] **Artifact uploads:** photos, documents, audio via Supabase Storage (10MB limit)
- [x] **Artifact linking:** attach to events, eras, or standalone
- [x] **Artifact gallery:** filterable grid view with type & era filters, image previews
- [x] **External links:** URLs, playlist links, social post links
- [x] **Cultural influences:** CRUD with 10 categories, era linking, "why it mattered", image URL
- [x] **Influence grid:** grid & mosaic (grouped by category) views with filtering

---

## Phase 5 — Dashboard & Stats ✅
> The home screen and fun metrics

- [x] **Life dashboard:** current identity snapshot, active era, recent events, prompt of the day (20 rotating prompts), 5 stat cards
- [x] **Life stats:** auto-computed — timeline span, longest era, events by layer, events by era, top tags, influences by category, artifacts by type, personality dimension coverage
- [x] **Manual stats:** deferred — auto-computed stats cover the initial use cases
- [x] **Stats display:** dashboard-style cards with counts, breakdowns, and highlights

---

## Phase 6 — AI Features
> Intelligence layer

- [ ] **AI life summary:** generate narrative from all user data
- [ ] **Tone selection:** reflective, factual, storytelling
- [ ] **Regenerate on demand**
- [ ] **Guided prompts:** AI-powered reflection questions based on existing data
- [ ] **Export summary:** PDF or text download

---

## Phase 7 — Polish & Launch Prep
> Make it feel finished

- [ ] **Landing page:** marketing page with product pitch
- [ ] **Onboarding flow:** guided first-time experience (add your first era, first event)
- [ ] **Responsive design:** mobile-friendly across all views
- [ ] **Loading states and empty states**
- [ ] **Error handling and validation UX**
- [ ] **Data export:** download all data as JSON
- [ ] **Account deletion**
- [ ] **Performance optimization**

---

## Future Phases (Post-V1)

### Phase 8 — Relationships
- [ ] Relationship map (visual)
- [ ] Person entries with influence tracking
- [ ] Link people to events

### Phase 9 — Advanced Reflection
- [ ] Letters across time (past/future self)
- [ ] "Forks in the road" feature
- [ ] Theme detection (AI-powered)
- [ ] Event linking ("this led to that")

### Phase 10 — Social Layer
- [ ] Private sharing (selected content with trusted people)
- [ ] Collaborative memory (others contribute perspectives)
- [ ] Curated public profile page

### Phase 11 — Community
- [ ] Circles (invite-only reflection groups)
- [ ] Annual reflections
- [ ] Shared lessons

### Phase 12 — Legacy
- [ ] Export to book format
- [ ] Documentary-style site export
- [ ] Family archive / memory vault
- [ ] Generational family tree with stories
