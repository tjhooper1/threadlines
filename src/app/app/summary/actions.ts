"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
    eras,
    events,
    identitySnapshots,
    personalityEntries,
    culturalInfluences,
} from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/ai/openai";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

type Tone = "reflective" | "factual" | "storytelling";

async function gatherLifeContext(userId: string) {
    const [allEras, allEvents, latestIdentity, allPersonality, allInfluences] =
        await Promise.all([
            db
                .select()
                .from(eras)
                .where(eq(eras.userId, userId))
                .orderBy(eras.sortOrder),
            db
                .select()
                .from(events)
                .where(eq(events.userId, userId))
                .orderBy(desc(events.date)),
            db
                .select()
                .from(identitySnapshots)
                .where(eq(identitySnapshots.userId, userId))
                .orderBy(desc(identitySnapshots.capturedAt))
                .limit(1)
                .then((rows) => rows[0] ?? null),
            db
                .select()
                .from(personalityEntries)
                .where(eq(personalityEntries.userId, userId)),
            db
                .select()
                .from(culturalInfluences)
                .where(eq(culturalInfluences.userId, userId)),
        ]);

    const eraMap = new Map(allEras.map((e) => [e.id, e.name]));

    let context = "";

    // Eras
    if (allEras.length > 0) {
        context += "## Life Eras\n";
        for (const era of allEras) {
            context += `- **${era.name}**`;
            if (era.startDate) context += ` (${era.startDate}`;
            if (era.endDate) context += ` – ${era.endDate})`;
            else if (era.startDate) context += ` – present)`;
            if (era.summary) context += `: ${era.summary}`;
            if (era.lessonLearned)
                context += ` Lesson: ${era.lessonLearned}`;
            const traits = (era.definingTraits as string[]) ?? [];
            if (traits.length > 0)
                context += ` Traits: ${traits.join(", ")}`;
            context += "\n";
        }
        context += "\n";
    }

    // Events
    if (allEvents.length > 0) {
        context += "## Key Life Events\n";
        for (const event of allEvents.slice(0, 50)) {
            context += `- **${event.title}**`;
            if (event.date) context += ` (${event.date})`;
            const eraName = event.eraId ? eraMap.get(event.eraId) : null;
            if (eraName) context += ` [Era: ${eraName}]`;
            if (event.description) context += `: ${event.description}`;
            if (event.impact) context += ` Impact: ${event.impact}`;
            if (event.beliefCreated)
                context += ` Belief created: ${event.beliefCreated}`;
            if (event.downstreamEffects)
                context += ` Downstream: ${event.downstreamEffects}`;
            const tags = (event.tags as string[]) ?? [];
            if (tags.length > 0) context += ` Tags: ${tags.join(", ")}`;
            context += "\n";
        }
        if (allEvents.length > 50)
            context += `(${allEvents.length - 50} more events not shown)\n`;
        context += "\n";
    }

    // Identity
    if (latestIdentity) {
        context += "## Current Identity\n";
        const past = (latestIdentity.pastSelf as string[]) ?? [];
        const current = (latestIdentity.currentSelf as string[]) ?? [];
        const future = (latestIdentity.futureSelf as string[]) ?? [];
        if (past.length > 0) context += `- Who I was: ${past.join(", ")}\n`;
        if (current.length > 0)
            context += `- Who I am: ${current.join(", ")}\n`;
        if (future.length > 0)
            context += `- Who I'm becoming: ${future.join(", ")}\n`;
        if (latestIdentity.notes)
            context += `- Notes: ${latestIdentity.notes}\n`;
        context += "\n";
    }

    // Personality
    if (allPersonality.length > 0) {
        context += "## Personality Dimensions\n";
        for (const entry of allPersonality) {
            context += `- **${entry.dimension}**: ${entry.value ?? ""}`;
            if (entry.notes) context += ` (${entry.notes})`;
            context += "\n";
        }
        context += "\n";
    }

    // Cultural influences
    if (allInfluences.length > 0) {
        context += "## Cultural Influences\n";
        for (const inf of allInfluences) {
            context += `- **${inf.name}** (${inf.category})`;
            if (inf.ageOrYear) context += ` at age/year ${inf.ageOrYear}`;
            if (inf.whyItMattered)
                context += `: ${inf.whyItMattered}`;
            context += "\n";
        }
        context += "\n";
    }

    return context;
}

const TONE_INSTRUCTIONS: Record<Tone, string> = {
    reflective:
        "Write in a warm, introspective, second-person tone — as if the person is reflecting on their own life with compassion and self-awareness. Use phrases like 'you learned', 'you became', 'this shaped you'. Be gentle but honest.",
    factual:
        "Write in a clear, third-person biographical tone — like a well-written Wikipedia article. Focus on facts, dates, cause and effect. Be precise and structured.",
    storytelling:
        "Write in a vivid, narrative first-person tone — like the opening chapter of a memoir. Use imagery, pacing, and emotional beats. Make the reader feel the moments. Start with a hook.",
};

export async function generateLifeSummary(tone: Tone): Promise<string> {
    const userId = await getUserId();
    const context = await gatherLifeContext(userId);

    if (!context.trim()) {
        return "Not enough data to generate a summary yet. Add some eras, events, and identity traits to get started.";
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.8,
        max_tokens: 2000,
        messages: [
            {
                role: "system",
                content: `You are a thoughtful life biographer. You will receive structured data about someone's life — their eras, key events, identity evolution, personality traits, and cultural influences. Your job is to weave this into a compelling life summary.\n\n${TONE_INSTRUCTIONS[tone]}\n\nGuidelines:\n- Be concise but meaningful (aim for 3-6 paragraphs)\n- Connect events to identity changes\n- Highlight patterns and growth\n- Never invent facts — only use what's provided\n- End with something forward-looking based on their "becoming" identity`,
            },
            {
                role: "user",
                content: `Here is the life data:\n\n${context}\n\nPlease write a life summary in the ${tone} tone.`,
            },
        ],
    });

    return (
        response.choices[0]?.message?.content ??
        "Unable to generate summary. Please try again."
    );
}

export async function generateReflectionPrompts(): Promise<string[]> {
    const userId = await getUserId();
    const context = await gatherLifeContext(userId);

    if (!context.trim()) {
        return [
            "What's the first era of your life you'd name?",
            "What's a moment that changed the way you see yourself?",
            "What's something you're becoming that surprises you?",
        ];
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.9,
        max_tokens: 600,
        messages: [
            {
                role: "system",
                content: `You are a thoughtful reflection coach. Based on someone's life data, generate 5 personalized, thought-provoking reflection questions. These should:\n- Reference specific eras, events, or patterns from their data\n- Encourage deeper self-understanding\n- Be open-ended (not yes/no)\n- Mix past reflection with future intention\n\nReturn ONLY a JSON array of 5 strings. No markdown, no explanation.`,
            },
            {
                role: "user",
                content: `Here is the life data:\n\n${context}\n\nGenerate 5 personalized reflection questions.`,
            },
        ],
    });

    const text = response.choices[0]?.message?.content ?? "[]";
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(String);
        }
    } catch {
        // fallback: split by newlines
        const lines = text
            .split("\n")
            .map((l) => l.replace(/^\d+\.\s*/, "").trim())
            .filter(Boolean);
        if (lines.length > 0) return lines.slice(0, 5);
    }

    return [
        "What pattern keeps showing up across your eras?",
        "What's a moment you haven't fully processed yet?",
        "What would your future self thank you for right now?",
    ];
}
