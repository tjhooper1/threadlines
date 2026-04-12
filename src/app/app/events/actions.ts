"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, eras } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { createEventSchema, updateEventSchema } from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getEvents() {
    const userId = await getUserId();
    return db
        .select({
            event: events,
            eraName: eras.name,
        })
        .from(events)
        .leftJoin(eras, eq(events.eraId, eras.id))
        .where(eq(events.userId, userId))
        .orderBy(desc(events.date), desc(events.createdAt));
}

export async function getEvent(id: string) {
    const userId = await getUserId();
    const [result] = await db
        .select({
            event: events,
            eraName: eras.name,
        })
        .from(events)
        .leftJoin(eras, eq(events.eraId, eras.id))
        .where(and(eq(events.id, id), eq(events.userId, userId)));
    return result ?? null;
}

export async function createEvent(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        title: formData.get("title") as string,
        date: (formData.get("date") as string) || undefined,
        datePrecision:
            (formData.get("datePrecision") as string) || "day",
        description: (formData.get("description") as string) || undefined,
        impact: (formData.get("impact") as string) || undefined,
        beliefCreated: (formData.get("beliefCreated") as string) || undefined,
        downstreamEffects:
            (formData.get("downstreamEffects") as string) || undefined,
        tags: formData.get("tags")
            ? JSON.parse(formData.get("tags") as string)
            : [],
        layer: (formData.get("layer") as string) || "life_event",
        eraId: (formData.get("eraId") as string) || null,
    };

    const data = createEventSchema.parse(raw);

    await db.insert(events).values({
        userId,
        ...data,
    });

    revalidatePath("/app/events");
    revalidatePath("/app/eras");
    revalidatePath("/app/dashboard");
    redirect("/app/events");
}

export async function updateEvent(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        title: (formData.get("title") as string) || undefined,
        date: (formData.get("date") as string) || undefined,
        datePrecision:
            (formData.get("datePrecision") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        impact: (formData.get("impact") as string) || undefined,
        beliefCreated: (formData.get("beliefCreated") as string) || undefined,
        downstreamEffects:
            (formData.get("downstreamEffects") as string) || undefined,
        tags: formData.get("tags")
            ? JSON.parse(formData.get("tags") as string)
            : undefined,
        layer: (formData.get("layer") as string) || undefined,
        eraId: formData.has("eraId")
            ? (formData.get("eraId") as string) || null
            : undefined,
    };

    const data = updateEventSchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(events)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(events.id, id), eq(events.userId, userId)));

    revalidatePath("/app/events");
    revalidatePath("/app/eras");
    revalidatePath("/app/dashboard");
    redirect("/app/events");
}

export async function deleteEvent(formData: FormData) {
    const userId = await getUserId();
    const id = formData.get("id") as string;

    await db
        .delete(events)
        .where(and(eq(events.id, id), eq(events.userId, userId)));

    revalidatePath("/app/events");
    revalidatePath("/app/eras");
    revalidatePath("/app/dashboard");
}
