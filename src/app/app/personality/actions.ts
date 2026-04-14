"use server";

import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { personalityEntries, eras } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
    createPersonalityEntrySchema,
    updatePersonalityEntrySchema,
} from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getPersonalityEntries() {
    const userId = await getUserId();
    return db
        .select({
            entry: personalityEntries,
            eraName: eras.name,
        })
        .from(personalityEntries)
        .leftJoin(eras, eq(personalityEntries.eraId, eras.id))
        .where(eq(personalityEntries.userId, userId))
        .orderBy(desc(personalityEntries.createdAt));
}

export async function createPersonalityEntry(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        eraId: (formData.get("eraId") as string) || null,
        dimension: formData.get("dimension") as string,
        value: formData.get("value") as string,
        notes: (formData.get("notes") as string) || undefined,
    };

    const data = createPersonalityEntrySchema.parse(raw);

    await db.insert(personalityEntries).values({
        userId,
        ...data,
    });

    revalidatePath("/app/personality");
}

export async function updatePersonalityEntry(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        eraId: formData.has("eraId")
            ? (formData.get("eraId") as string) || null
            : undefined,
        dimension: (formData.get("dimension") as string) || undefined,
        value: (formData.get("value") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
    };

    const data = updatePersonalityEntrySchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(personalityEntries)
        .set({ ...updates, updatedAt: new Date() })
        .where(
            and(
                eq(personalityEntries.id, id),
                eq(personalityEntries.userId, userId),
            ),
        );

    revalidatePath("/app/personality");
}

export async function deletePersonalityEntry(formData: FormData) {
    const userId = await getUserId();
    const id = formData.get("id") as string;

    await db
        .delete(personalityEntries)
        .where(
            and(
                eq(personalityEntries.id, id),
                eq(personalityEntries.userId, userId),
            ),
        );

    revalidatePath("/app/personality");
}
