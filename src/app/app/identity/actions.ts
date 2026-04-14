"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { identitySnapshots } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
    createIdentitySnapshotSchema,
    updateIdentitySnapshotSchema,
} from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getIdentitySnapshots() {
    const userId = await getUserId();
    return db
        .select()
        .from(identitySnapshots)
        .where(eq(identitySnapshots.userId, userId))
        .orderBy(desc(identitySnapshots.capturedAt));
}

export async function getLatestIdentitySnapshot() {
    const userId = await getUserId();
    const [snapshot] = await db
        .select()
        .from(identitySnapshots)
        .where(eq(identitySnapshots.userId, userId))
        .orderBy(desc(identitySnapshots.capturedAt))
        .limit(1);
    return snapshot ?? null;
}

export async function createIdentitySnapshot(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        pastSelf: formData.get("pastSelf")
            ? JSON.parse(formData.get("pastSelf") as string)
            : [],
        currentSelf: formData.get("currentSelf")
            ? JSON.parse(formData.get("currentSelf") as string)
            : [],
        futureSelf: formData.get("futureSelf")
            ? JSON.parse(formData.get("futureSelf") as string)
            : [],
        notes: (formData.get("notes") as string) || undefined,
    };

    const data = createIdentitySnapshotSchema.parse(raw);

    await db.insert(identitySnapshots).values({
        userId,
        ...data,
    });

    revalidatePath("/app/identity");
}

export async function updateIdentitySnapshot(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        pastSelf: formData.get("pastSelf")
            ? JSON.parse(formData.get("pastSelf") as string)
            : undefined,
        currentSelf: formData.get("currentSelf")
            ? JSON.parse(formData.get("currentSelf") as string)
            : undefined,
        futureSelf: formData.get("futureSelf")
            ? JSON.parse(formData.get("futureSelf") as string)
            : undefined,
        notes: (formData.get("notes") as string) || undefined,
    };

    const data = updateIdentitySnapshotSchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(identitySnapshots)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(identitySnapshots.id, id));

    revalidatePath("/app/identity");
}
