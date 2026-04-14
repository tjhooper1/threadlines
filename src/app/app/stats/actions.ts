"use server";

import { eq, count, desc, min, max, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
    eras,
    events,
    artifacts,
    identitySnapshots,
    personalityEntries,
    culturalInfluences,
} from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export type LifeStats = {
    totalEras: number;
    totalEvents: number;
    totalArtifacts: number;
    totalInfluences: number;
    totalIdentityVersions: number;
    totalPersonalityEntries: number;
    currentEra: string | null;
    longestEra: { name: string; days: number } | null;
    earliestEvent: string | null;
    latestEvent: string | null;
    timeSpanYears: number | null;
    eventsByLayer: Record<string, number>;
    eventsByEra: { name: string; count: number }[];
    influencesByCategory: Record<string, number>;
    artifactsByType: Record<string, number>;
    topTags: { tag: string; count: number }[];
    personalityDimensions: number;
};

export async function getLifeStats(): Promise<LifeStats> {
    const userId = await getUserId();

    const [
        [eraCountResult],
        [eventCountResult],
        [artifactCountResult],
        [influenceCountResult],
        [identityCountResult],
        [personalityCountResult],
        eraList,
        allEvents,
        allArtifacts,
        allInfluences,
        allPersonality,
    ] = await Promise.all([
        db.select({ value: count() }).from(eras).where(eq(eras.userId, userId)),
        db.select({ value: count() }).from(events).where(eq(events.userId, userId)),
        db.select({ value: count() }).from(artifacts).where(eq(artifacts.userId, userId)),
        db.select({ value: count() }).from(culturalInfluences).where(eq(culturalInfluences.userId, userId)),
        db.select({ value: count() }).from(identitySnapshots).where(eq(identitySnapshots.userId, userId)),
        db.select({ value: count() }).from(personalityEntries).where(eq(personalityEntries.userId, userId)),
        db.select().from(eras).where(eq(eras.userId, userId)).orderBy(eras.sortOrder),
        db.select().from(events).where(eq(events.userId, userId)).orderBy(desc(events.date)),
        db.select().from(artifacts).where(eq(artifacts.userId, userId)),
        db.select().from(culturalInfluences).where(eq(culturalInfluences.userId, userId)),
        db.select().from(personalityEntries).where(eq(personalityEntries.userId, userId)),
    ]);

    // Current era
    const currentEra = eraList.find((e) => !e.endDate)?.name ?? null;

    // Longest era
    let longestEra: { name: string; days: number } | null = null;
    for (const era of eraList) {
        if (era.startDate) {
            const start = new Date(era.startDate).getTime();
            const end = era.endDate
                ? new Date(era.endDate).getTime()
                : Date.now();
            const days = Math.floor((end - start) / 86400000);
            if (!longestEra || days > longestEra.days) {
                longestEra = { name: era.name, days };
            }
        }
    }

    // Time span
    const datedEvents = allEvents.filter((e) => e.date);
    let earliestEvent: string | null = null;
    let latestEvent: string | null = null;
    let timeSpanYears: number | null = null;

    if (datedEvents.length > 0) {
        const dates = datedEvents.map((e) => new Date(e.date!).getTime());
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        earliestEvent = new Date(minDate).toISOString().split("T")[0];
        latestEvent = new Date(maxDate).toISOString().split("T")[0];
        timeSpanYears = Math.round((maxDate - minDate) / (365.25 * 86400000) * 10) / 10;
    }

    // Events by layer
    const eventsByLayer: Record<string, number> = {};
    for (const event of allEvents) {
        const layer = event.layer ?? "life_event";
        eventsByLayer[layer] = (eventsByLayer[layer] ?? 0) + 1;
    }

    // Events by era
    const eraMap = new Map(eraList.map((e) => [e.id, e.name]));
    const eraEventCounts: Record<string, number> = {};
    for (const event of allEvents) {
        if (event.eraId && eraMap.has(event.eraId)) {
            const name = eraMap.get(event.eraId)!;
            eraEventCounts[name] = (eraEventCounts[name] ?? 0) + 1;
        }
    }
    const eventsByEra = Object.entries(eraEventCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // Influences by category
    const influencesByCategory: Record<string, number> = {};
    for (const inf of allInfluences) {
        influencesByCategory[inf.category] =
            (influencesByCategory[inf.category] ?? 0) + 1;
    }

    // Artifacts by type
    const artifactsByType: Record<string, number> = {};
    for (const art of allArtifacts) {
        artifactsByType[art.type] = (artifactsByType[art.type] ?? 0) + 1;
    }

    // Top tags
    const tagCounts: Record<string, number> = {};
    for (const event of allEvents) {
        const tags = (event.tags as string[]) ?? [];
        for (const tag of tags) {
            tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
        }
    }
    const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Unique personality dimensions used
    const dimensions = new Set(allPersonality.map((p) => p.dimension));

    return {
        totalEras: eraCountResult?.value ?? 0,
        totalEvents: eventCountResult?.value ?? 0,
        totalArtifacts: artifactCountResult?.value ?? 0,
        totalInfluences: influenceCountResult?.value ?? 0,
        totalIdentityVersions: identityCountResult?.value ?? 0,
        totalPersonalityEntries: personalityCountResult?.value ?? 0,
        currentEra,
        longestEra,
        earliestEvent,
        latestEvent,
        timeSpanYears,
        eventsByLayer,
        eventsByEra,
        influencesByCategory,
        artifactsByType,
        topTags,
        personalityDimensions: dimensions.size,
    };
}
