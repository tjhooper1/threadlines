# V1 Feature Spec

V1 is the **private autobiography tool**. No social features yet. The goal is to test whether people feel emotionally attached to their Threadline.

---

## 1. Account & Profile

### User Profile
- Display name, avatar, date of birth, current location
- Short bio / tagline ("Builder. Father. Work in progress.")
- Life motto or guiding values (optional)

### Settings
- Email/password auth (Supabase Auth)
- Privacy defaults (everything private by default)
- Theme preference (light/dark)
- Export options

---

## 2. Life Timeline

The central feature. A layered, visual timeline of an entire life.

### Layers
Each can be toggled on/off:

| Layer | Description | Examples |
|---|---|---|
| **Life Events** | Major milestones | Birth, moves, schools, graduations, jobs, relationships, losses, wins |
| **Identity Phases** | Named self-descriptions per era | "Shy kid," "ambitious era," "burnout period," "dad era" |
| **Interests & Obsessions** | Things that consumed attention | Games, music, fitness, faith, career, creativity |
| **Emotional Periods** | Felt experience over time | Confidence, anxiety, loneliness, purpose, joy |
| **Environment** | External context | Where you lived, who was around, family structure, finances |

### Timeline UI
- Horizontal scroll by default
- Zoomable: decade → year → month → week
- Each item is a card that expands to full detail
- Color-coded by layer
- Filterable by layer, era, date range, tags

---

## 3. Eras & Chapters

Users organize their life into named eras instead of (or in addition to) raw years.

### Era Properties
- **Name:** "Small Town Years," "Lost Years," "Grind Mode," "Starting Over"
- **Date range:** start and end (or "ongoing")
- **Summary:** 1–3 sentence description
- **Defining traits:** what characterized this era
- **Key events:** linked event cards
- **Soundtrack/vibe:** optional playlist or cultural references
- **Lesson learned:** what this era taught you

### Features
- Visual era bar on the timeline
- Tap an era to see everything within it
- Suggested era boundaries based on event clustering (future AI feature)

---

## 4. Key Event Cards

Each major life event gets a structured card.

### Card Fields
| Field | Description |
|---|---|
| **Title** | Short name ("Parents divorced," "Moved to Austin") |
| **Date** | When it happened (exact or approximate) |
| **What happened** | Factual description |
| **How it affected me** | Emotional/psychological impact |
| **What belief it created** | "I can only rely on myself," "Change is always bad" |
| **What it changed later** | Downstream effects on decisions, relationships, identity |
| **Era** | Which era this belongs to |
| **Tags** | Freeform tags for filtering |
| **Artifacts** | Attached photos, screenshots, documents |
| **People involved** | Linked relationship entries |

### Features
- Quick-add mode (just title + date + short note)
- Full reflection mode (all fields)
- AI-assisted prompts to fill in deeper fields
- Link events to other events ("this led to that")

---

## 5. "Who I Was / Who I Am / Who I'm Becoming"

A dedicated screen for identity reflection.

### Three Columns

| Past Self | Current Self | Future Self |
|---|---|---|
| Quiet, reactive, survival-minded | Thoughtful, responsible, building-oriented | Mentor, creator, calmer father |
| Traits, beliefs, fears | Current values, strengths, struggles | Aspirations, goals, possible paths |

### Features
- Editable text cards in each column
- AI-generated summary based on timeline data (future)
- Versioned — save snapshots over time to see how self-perception evolves
- Exportable as a one-page identity summary

---

## 6. Personality & Values Reflections

Personality as a timeline, not a static label.

### Trackable Dimensions
- Confidence over time
- Introversion / extroversion by era
- Core values by era
- Stress triggers
- Motivations
- Recurring strengths
- Recurring self-sabotage patterns
- Attachment style reflections

### Features
- Simple slider or tag-based input per era
- Visualization as a line chart or heatmap over time
- AI-generated personality evolution summary (future)

---

## 7. Artifacts & Evidence

Attach real-world evidence to make the life story tangible.

### Supported Types
- Photos and images
- Videos (upload or link)
- Voice notes / audio
- Screenshots
- Documents (report cards, resumes, letters)
- Text message screenshots
- Journal entries (text)
- Old social media posts
- Playlists (Spotify/Apple Music links)
- URLs and bookmarks

### Features
- Attach to: events, eras, relationships, or standalone
- Gallery view across all artifacts
- Timeline view filtered to artifacts only
- Storage via Supabase Storage (S3-backed)

---

## 8. "What Made Me Me" — Cultural Influences

A section for the culture, media, and environment that shaped identity.

### Categories
- Songs / albums / artists
- Shows / movies
- Games
- Books
- Places
- Internet eras (forums, early social media, YouTube phases)
- Trends and aesthetics
- Family sayings and traditions
- Church / community / school influences
- Subcultures and scenes

### Features
- Tag with era/age
- Add a note on why it mattered
- Visual grid or mosaic display

---

## 9. Life Stats

Fun, tasteful summary statistics.

### Stats
- Cities lived in
- Jobs held
- Years in relationships
- Closest friends by duration
- Number of creative projects
- Years spent on major activities (gaming, lifting, parenting, coding)
- "Most transformative year"
- "Hardest season"
- "Most identity-shaping decade"

### Features
- Auto-calculated from timeline data where possible
- Manual override
- Dashboard-style display
- Shareable stat cards (future)

---

## 10. AI Life Summary

An AI-generated narrative summary of the user's life based on all entered data.

### Output
- 1–2 page written summary
- Tone: warm, insightful, narrative (not clinical)
- Highlights patterns, turning points, growth arcs
- Updates as more data is added

### Features
- Regenerate on demand
- Choose tone (reflective, factual, storytelling)
- Export as PDF or text

---

## 11. Life Dashboard (Home Screen)

The landing page after login.

### Components
- Current identity summary (from "Who I Am")
- Top values
- Active era name + duration
- Recent reflections / entries
- Timeline snapshot (last 5 events)
- Life stats highlights
- Prompt of the day (guided reflection)

---

## Out of Scope for V1

These are planned but not in the first release:

- [ ] Relationship map (visual)
- [ ] Theme detection (AI)
- [ ] Letters across time
- [ ] "Forks in the road" feature
- [ ] Collaborative memory (others contribute)
- [ ] Sharing / private profiles
- [ ] Circles (community)
- [ ] Public profiles
- [ ] Export to book / documentary
- [ ] Legacy mode
- [ ] Mobile app
