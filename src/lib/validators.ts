import { z } from "zod/v4";

// ── Eras ────────────────────────────────────────────────────────────────────

export const createEraSchema = z.object({
    name: z.string().min(1, "Name is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    definingTraits: z.array(z.string()).default([]),
    lessonLearned: z.string().optional(),
    sortOrder: z.number().int().default(0),
});

export const updateEraSchema = createEraSchema.partial().extend({
    id: z.string().uuid(),
});

export type CreateEraInput = z.infer<typeof createEraSchema>;
export type UpdateEraInput = z.infer<typeof updateEraSchema>;

// ── Events ──────────────────────────────────────────────────────────────────

export const datePrecisionValues = ["year", "month", "day"] as const;
export const eventLayerValues = [
    "life_event",
    "identity",
    "interest",
    "emotion",
    "environment",
] as const;

export const createEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().optional(),
    datePrecision: z.enum(datePrecisionValues).default("day"),
    description: z.string().optional(),
    impact: z.string().optional(),
    beliefCreated: z.string().optional(),
    downstreamEffects: z.string().optional(),
    tags: z.array(z.string()).default([]),
    layer: z.enum(eventLayerValues).default("life_event"),
    eraId: z.string().uuid().optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial().extend({
    id: z.string().uuid(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
