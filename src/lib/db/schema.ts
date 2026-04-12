import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    date,
    jsonb,
    pgEnum,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────────

export const datePrecisionEnum = pgEnum("date_precision", [
    "year",
    "month",
    "day",
]);

export const eventLayerEnum = pgEnum("event_layer", [
    "life_event",
    "identity",
    "interest",
    "emotion",
    "environment",
]);

export const artifactTypeEnum = pgEnum("artifact_type", [
    "photo",
    "video",
    "audio",
    "document",
    "screenshot",
    "text",
    "link",
    "playlist",
]);

export const personalityDimensionEnum = pgEnum("personality_dimension", [
    "confidence",
    "introversion",
    "values",
    "triggers",
    "motivations",
    "strengths",
    "sabotage",
]);

export const influenceCategoryEnum = pgEnum("influence_category", [
    "song",
    "show",
    "game",
    "book",
    "place",
    "internet",
    "trend",
    "family",
    "community",
    "subculture",
]);

export const relationshipTypeEnum = pgEnum("relationship_type", [
    "family",
    "friend",
    "mentor",
    "rival",
    "partner",
    "coworker",
]);

export const personStatusEnum = pgEnum("person_status", [
    "active",
    "distant",
    "lost",
    "deceased",
]);

export const eventLinkRelationEnum = pgEnum("event_link_relation", [
    "led_to",
    "caused_by",
    "related_to",
    "contrasts_with",
]);

// ── Tables ─────────────────────────────────────────────────────────────────

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(), // matches Supabase auth.users.id
    email: text("email").notNull(),
    displayName: text("display_name"),
    avatar: text("avatar"),
    dateOfBirth: date("date_of_birth"),
    currentLocation: text("current_location"),
    bio: text("bio"),
    motto: text("motto"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const eras = pgTable("eras", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    name: text("name").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    summary: text("summary"),
    definingTraits: jsonb("defining_traits").$type<string[]>().default([]),
    lessonLearned: text("lesson_learned"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const events = pgTable("events", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    eraId: uuid("era_id").references(() => eras.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    date: date("date"),
    datePrecision: datePrecisionEnum("date_precision").default("day"),
    description: text("description"),
    impact: text("impact"),
    beliefCreated: text("belief_created"),
    downstreamEffects: text("downstream_effects"),
    tags: jsonb("tags").$type<string[]>().default([]),
    layer: eventLayerEnum("layer").default("life_event"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const artifacts = pgTable("artifacts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    eventId: uuid("event_id").references(() => events.id, {
        onDelete: "set null",
    }),
    eraId: uuid("era_id").references(() => eras.id, { onDelete: "set null" }),
    type: artifactTypeEnum("type").notNull(),
    url: text("url").notNull(),
    caption: text("caption"),
    date: date("date"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const identitySnapshots = pgTable("identity_snapshots", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    pastSelf: jsonb("past_self").$type<string[]>().default([]),
    currentSelf: jsonb("current_self").$type<string[]>().default([]),
    futureSelf: jsonb("future_self").$type<string[]>().default([]),
    notes: text("notes"),
    capturedAt: timestamp("captured_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const personalityEntries = pgTable("personality_entries", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    eraId: uuid("era_id").references(() => eras.id, { onDelete: "set null" }),
    dimension: personalityDimensionEnum("dimension").notNull(),
    value: text("value"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const culturalInfluences = pgTable("cultural_influences", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    category: influenceCategoryEnum("category").notNull(),
    name: text("name").notNull(),
    eraId: uuid("era_id").references(() => eras.id, { onDelete: "set null" }),
    ageOrYear: text("age_or_year"),
    whyItMattered: text("why_it_mattered"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const persons = pgTable("persons", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    name: text("name").notNull(),
    relationship: relationshipTypeEnum("relationship"),
    metDate: date("met_date"),
    influence: text("influence"),
    currentStatus: personStatusEnum("current_status").default("active"),
    partOfYouTheyShaped: text("part_of_you_they_shaped"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const eventLinks = pgTable("event_links", {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceEventId: uuid("source_event_id")
        .references(() => events.id, { onDelete: "cascade" })
        .notNull(),
    targetEventId: uuid("target_event_id")
        .references(() => events.id, { onDelete: "cascade" })
        .notNull(),
    relationship: eventLinkRelationEnum("relationship").notNull(),
    notes: text("notes"),
});

export const eventPersons = pgTable("event_persons", {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
        .references(() => events.id, { onDelete: "cascade" })
        .notNull(),
    personId: uuid("person_id")
        .references(() => persons.id, { onDelete: "cascade" })
        .notNull(),
    role: text("role"),
});
