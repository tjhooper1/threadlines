# Development Roadmap

## Phase 0 — Project Setup
> Foundation: scaffolding, tooling, database, auth

- [ ] Initialize Next.js 15 with TypeScript, Tailwind, pnpm
- [ ] Install and configure shadcn/ui
- [ ] Set up Supabase project (local or remote)
- [ ] Configure Drizzle ORM with Supabase Postgres
- [ ] Define database schema and run initial migration
- [ ] Implement Supabase Auth (signup, login, logout)
- [ ] Create authenticated app layout (sidebar + nav)
- [ ] Set up route groups: `(marketing)` and `(app)`
- [ ] Configure environment variables and `.env.local`
- [ ] Set up ESLint + Prettier

---

## Phase 1 — Core Data Entry
> Let users start building their life story

- [ ] **Eras:** CRUD for life eras (name, dates, summary, traits, lesson)
- [ ] **Events:** CRUD for life events (all card fields)
- [ ] **Event ↔ Era linking:** assign events to eras
- [ ] **Quick-add event flow:** title + date + short note (minimal friction)
- [ ] **Full event reflection mode:** all fields including impact, beliefs, downstream effects
- [ ] **Tags system:** freeform tags on events, filterable
- [ ] **Date flexibility:** support year-only, month-only, and exact dates

---

## Phase 2 — Timeline
> The centerpiece visual experience

- [ ] **Timeline view:** horizontal scrollable timeline of all events
- [ ] **Layer system:** toggle life events, identity, interests, emotions, environment
- [ ] **Color coding:** by layer type
- [ ] **Era bars:** visual era spans on the timeline
- [ ] **Zoom levels:** decade → year → month
- [ ] **Click-to-expand:** tap any event to see its full card
- [ ] **Filters:** by layer, era, tags, date range

---

## Phase 3 — Identity & Personality
> Self-understanding features

- [ ] **Identity screen:** "Who I Was / Am / Becoming" with editable cards
- [ ] **Identity snapshots:** save versions over time
- [ ] **Personality entries:** per-era ratings on dimensions (confidence, introversion, values, etc.)
- [ ] **Personality visualization:** line chart or heatmap over time
- [ ] **Values tracker:** core values per era

---

## Phase 4 — Artifacts & Influences
> Make it real and tangible

- [ ] **Artifact uploads:** photos, documents, audio via Supabase Storage
- [ ] **Artifact linking:** attach to events, eras, or standalone
- [ ] **Artifact gallery:** filterable grid view
- [ ] **External links:** URLs, playlist links, social post links
- [ ] **Cultural influences:** CRUD with category, era, and "why it mattered"
- [ ] **Influence grid:** visual mosaic display

---

## Phase 5 — Dashboard & Stats
> The home screen and fun metrics

- [ ] **Life dashboard:** current identity, active era, recent events, prompt of the day
- [ ] **Life stats:** auto-computed where possible (cities, jobs, years in relationships, etc.)
- [ ] **Manual stats:** user-entered where auto-compute isn't feasible
- [ ] **Stats display:** dashboard-style cards

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
