# Information Architecture

## Sitemap

```
/                           → Landing / Marketing page (logged out)
/login                      → Login
/signup                     → Sign up
/app                        → Redirect to /app/dashboard

/app/dashboard              → Life Dashboard (home)
/app/timeline               → Full life timeline (layered, filterable)
/app/eras                   → All eras list
/app/eras/[id]              → Single era detail view
/app/events                 → All events list
/app/events/new             → Create new event
/app/events/[id]            → Single event card (full detail)
/app/events/[id]/edit       → Edit event
/app/identity               → "Who I Was / Am / Becoming" screen
/app/personality             → Personality & values over time
/app/artifacts              → Artifact gallery
/app/influences             → "What Made Me Me" cultural influences
/app/stats                  → Life stats dashboard
/app/summary                → AI-generated life summary
/app/settings               → Account settings
/app/settings/profile       → Edit profile
/app/settings/account       → Email, password, delete account
/app/settings/export        → Export data
```

---

## Data Model (Conceptual)

### User
```
User
├── id
├── email
├── displayName
├── avatar
├── dateOfBirth
├── currentLocation
├── bio
├── motto
├── createdAt
└── updatedAt
```

### Era
```
Era
├── id
├── userId
├── name                    ("Lost Years", "Grind Mode")
├── startDate
├── endDate                 (nullable = ongoing)
├── summary
├── definingTraits[]
├── lessonLearned
├── sortOrder
├── createdAt
└── updatedAt
```

### Event
```
Event
├── id
├── userId
├── eraId                   (nullable)
├── title
├── date                    (can be approximate: year, month, or exact)
├── datePrecision           (year | month | day)
├── description             (what happened)
├── impact                  (how it affected me)
├── beliefCreated           (what belief it created)
├── downstreamEffects       (what it changed later)
├── tags[]
├── layer                   (life_event | identity | interest | emotion | environment)
├── createdAt
└── updatedAt
```

### Artifact
```
Artifact
├── id
├── userId
├── eventId                 (nullable)
├── eraId                   (nullable)
├── type                    (photo | video | audio | document | screenshot | text | link | playlist)
├── url                     (storage URL or external link)
├── caption
├── date
├── createdAt
└── updatedAt
```

### Identity Snapshot
```
IdentitySnapshot
├── id
├── userId
├── pastSelf[]              (array of trait strings)
├── currentSelf[]
├── futureSelf[]
├── notes
├── capturedAt              (when this snapshot was taken)
├── createdAt
└── updatedAt
```

### Personality Entry
```
PersonalityEntry
├── id
├── userId
├── eraId                   (nullable)
├── dimension               (confidence | introversion | values | triggers | motivations | strengths | sabotage)
├── value                   (text or numeric)
├── notes
├── createdAt
└── updatedAt
```

### Cultural Influence
```
CulturalInfluence
├── id
├── userId
├── category                (song | show | game | book | place | internet | trend | family | community | subculture)
├── name
├── eraId                   (nullable)
├── ageOrYear
├── whyItMattered
├── imageUrl                (nullable)
├── createdAt
└── updatedAt
```

### Person (Relationship Map — V2, but modeled now)
```
Person
├── id
├── userId
├── name
├── relationship            (family | friend | mentor | rival | partner | coworker)
├── metDate
├── influence               (how they influenced you)
├── currentStatus           (active | distant | lost | deceased)
├── partOfYouTheyShaped
├── createdAt
└── updatedAt
```

### Event Links (self-referencing)
```
EventLink
├── id
├── sourceEventId
├── targetEventId
├── relationship            (led_to | caused_by | related_to | contrasts_with)
├── notes
```

### Event ↔ Person (join table)
```
EventPerson
├── eventId
├── personId
├── role                    (e.g., "was there", "caused it", "helped me through it")
```

---

## Entity Relationships

```
User ────────── 1:N ──────── Era
User ────────── 1:N ──────── Event
User ────────── 1:N ──────── Artifact
User ────────── 1:N ──────── IdentitySnapshot
User ────────── 1:N ──────── PersonalityEntry
User ────────── 1:N ──────── CulturalInfluence
User ────────── 1:N ──────── Person

Era ─────────── 1:N ──────── Event
Era ─────────── 1:N ──────── Artifact
Era ─────────── 1:N ──────── PersonalityEntry
Era ─────────── 1:N ──────── CulturalInfluence

Event ───────── 1:N ──────── Artifact
Event ───────── N:M ──────── Event          (via EventLink)
Event ───────── N:M ──────── Person         (via EventPerson)
```

---

## Page → Data Dependencies

| Page | Primary Data | Secondary Data |
|---|---|---|
| Dashboard | User, current Era, recent Events | IdentitySnapshot (latest), Stats (computed), PersonalityEntry |
| Timeline | Events (all), Eras (all) | Artifacts (thumbnails), Persons |

### Timeline Architecture

The timeline is a client-side interactive component (`TimelineShell`) that receives server-fetched events and eras.

- **Layout:** Column-based horizontal scrollable grid. Each column represents a time period (decade/year/month).
- **Zoom levels:** Decade (300px/col), Year (180px/col), Month (140px/col).
- **Layer system:** 5 layers (life_event, identity, interest, emotion, environment) with independent toggle filters.
- **Era bars:** Absolute-positioned colored bands spanning from start to end column.
- **Event detail:** Click opens a right-side Sheet with full event card (description, impact, belief, downstream effects, tags) + edit link.
- **Filtering:** By active layers, by era (dropdown), undated events excluded with count indicator.
- **Auto-scroll:** On mount, scrolls to the most recent (rightmost) events.

Key files:
- `src/components/timeline/timeline-shell.tsx` — Main client component
- `src/app/(app)/timeline/page.tsx` — Server page (fetches data)
- Data from `events/actions.ts` (`getEvents`) and `eras/actions.ts` (`getEras`)

| Era Detail | Era, Events in era | Artifacts, PersonalityEntries, CulturalInfluences |
| Event Detail | Event | Artifacts, linked Events, linked Persons |
| Identity | IdentitySnapshot (all versions) | — |

### Identity Architecture

- **IdentityEditor** (`src/components/identity/identity-editor.tsx`): Three-column layout (Was/Am/Becoming) with trait tag editors. Supports updating the current snapshot or saving a new version.
- **SnapshotHistory** (`src/components/identity/snapshot-history.tsx`): Displays previous identity versions with timestamps and trait badges.
- **TraitListEditor** (`src/components/identity/trait-list-editor.tsx`): Reusable Enter-to-add tag input with Badge display.
- Server actions in `src/app/app/identity/actions.ts`: `getIdentitySnapshots`, `getLatestIdentitySnapshot`, `createIdentitySnapshot`, `updateIdentitySnapshot`.

### Personality Architecture

- **PersonalityEntryForm** (`src/components/personality/personality-entry-form.tsx`): Dimension select, era select, value input, notes textarea.
- **PersonalityEntryCard** (`src/components/personality/personality-entry-card.tsx`): Color-coded by dimension (7 colors), shows era name, delete action.
- Page groups entries by dimension in a grid layout.
- Server actions in `src/app/app/personality/actions.ts`: `getPersonalityEntries`, `createPersonalityEntry`, `updatePersonalityEntry`, `deletePersonalityEntry`.

| Personality | PersonalityEntry (all) | Eras (for labeling) |
| Artifacts | Artifacts (all) | Events, Eras (for context) |
| Influences | CulturalInfluence (all) | Eras (for grouping) |

### Artifacts Architecture

- **ArtifactForm** (`src/components/artifacts/artifact-form.tsx`): Type select (8 types), file upload for media types (photo/video/audio/document/screenshot) via Supabase Storage, URL input for link types, caption, date, era & event linking.
- **ArtifactCard** (`src/components/artifacts/artifact-card.tsx`): Type-specific icons and colors, image preview for photos/screenshots, external link display, era & event badges, delete action.
- **ArtifactGallery** (`src/components/artifacts/artifact-gallery.tsx`): Inline add form toggle, type filter, era filter, responsive grid layout, count indicator.
- File uploads go to Supabase Storage bucket `artifacts` under `{userId}/{timestamp}-{uuid}.{ext}`, 10MB limit.
- Server actions in `src/app/app/artifacts/actions.ts`: `getArtifacts` (with joins), `getArtifact`, `uploadArtifactFile`, `createArtifact`, `updateArtifact`, `deleteArtifact` (cleans up storage).

### Influences Architecture

- **InfluenceForm** (`src/components/influences/influence-form.tsx`): Category select (10 categories), name, era linking, age/year, "why it mattered" textarea, optional image URL.
- **InfluenceCard** (`src/components/influences/influence-card.tsx`): Category-specific icons and background colors, image display, era badge, delete action.
- **InfluenceGrid** (`src/components/influences/influence-grid.tsx`): Grid view (flat) and mosaic view (grouped by category), category & era filters, inline add form, view mode toggle.
- Server actions in `src/app/app/influences/actions.ts`: `getInfluences` (with era join), `getInfluence`, `createInfluence`, `updateInfluence`, `deleteInfluence`.

### Dashboard Architecture

- Server component at `src/app/app/dashboard/page.tsx` fetches all data in parallel: eras, recent events, event/artifact/influence counts, latest identity snapshot, personality entries.
- Shows: prompt of the day (20 rotating prompts, index based on day-of-year), 5 stat cards (eras, events, artifacts, influences, quick-add), current identity snapshot (Was/Am/Becoming badges), recent events list, eras grid.
- Prompt system is static — will be replaced by AI-powered prompts in Phase 6.

### Stats Architecture

- **getLifeStats** (`src/app/app/stats/actions.ts`): Server action that computes all stats in a single call. Queries all tables, computes: total counts (6), current era, longest era (by days), timeline span (earliest→latest event), events by layer, events by era, top 10 tags, influences by category, artifacts by type, personality dimension coverage.
- Stats page (`src/app/app/stats/page.tsx`): 6 overview counter cards, 3 highlight cards (timeline span, current era, longest era), breakdown cards (events by layer, events by era, top tags, influences by category, artifacts by type).
| Stats | Events, Eras, Persons, Artifacts | Computed aggregations |
| AI Summary | Events, Eras, IdentitySnapshot, PersonalityEntry | All (for context) |

### AI Summary Architecture

- **OpenAI client** (`src/lib/ai/openai.ts`): Singleton OpenAI client using `OPENAI_API_KEY` env var.
- **gatherLifeContext** (`src/app/app/summary/actions.ts`): Builds a markdown context string from all user data — eras, events (up to 50), latest identity snapshot, personality entries, and cultural influences.
- **generateLifeSummary** (`src/app/app/summary/actions.ts`): Server action. Accepts tone (`reflective | factual | storytelling`), each with a distinct system prompt. Calls GPT-4o with max 2000 tokens. Returns generated narrative text.
- **generateReflectionPrompts** (`src/app/app/summary/actions.ts`): Server action. Generates 5 personalized reflection questions as a JSON array. Uses GPT-4o with JSON-focused system prompt and fallback line-by-line parsing.
- **SummaryGenerator** (`src/components/summary/summary-generator.tsx`): Client component — tone selector (3 cards), generate/regenerate button, loading state, summary display with copy-to-clipboard and download-as-.txt actions.
- **GuidedPrompts** (`src/components/summary/guided-prompts.tsx`): Client component — generate/refresh button, numbered prompt list. Displayed on both the summary page and the dashboard.
