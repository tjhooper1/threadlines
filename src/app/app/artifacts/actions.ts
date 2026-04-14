"use server";

import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { artifacts, eras, events } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { createArtifactSchema, updateArtifactSchema } from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getArtifacts(filter?: {
    type?: string;
    eraId?: string;
    eventId?: string;
}) {
    const userId = await getUserId();

    let query = db
        .select({
            artifact: artifacts,
            eraName: eras.name,
            eventTitle: events.title,
        })
        .from(artifacts)
        .leftJoin(eras, eq(artifacts.eraId, eras.id))
        .leftJoin(events, eq(artifacts.eventId, events.id))
        .where(eq(artifacts.userId, userId))
        .orderBy(desc(artifacts.date), desc(artifacts.createdAt))
        .$dynamic();

    // Filtering is done client-side for simplicity since drizzle dynamic
    // where chaining is verbose. The dataset is per-user and small.
    const results = await query;

    return results.filter((r) => {
        if (filter?.type && r.artifact.type !== filter.type) return false;
        if (filter?.eraId && r.artifact.eraId !== filter.eraId) return false;
        if (filter?.eventId && r.artifact.eventId !== filter.eventId)
            return false;
        return true;
    });
}

export async function getArtifact(id: string) {
    const userId = await getUserId();
    const [result] = await db
        .select({
            artifact: artifacts,
            eraName: eras.name,
            eventTitle: events.title,
        })
        .from(artifacts)
        .leftJoin(eras, eq(artifacts.eraId, eras.id))
        .leftJoin(events, eq(artifacts.eventId, events.id))
        .where(and(eq(artifacts.id, id), eq(artifacts.userId, userId)));
    return result ?? null;
}

export async function uploadArtifactFile(formData: FormData) {
    const userId = await getUserId();
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
        throw new Error("No file provided");
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be under 10MB");
    }

    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "bin";
    const fileName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
        .from("artifacts")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("artifacts").getPublicUrl(data.path);

    return publicUrl;
}

export async function createArtifact(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        type: formData.get("type") as string,
        url: formData.get("url") as string,
        caption: (formData.get("caption") as string) || undefined,
        date: (formData.get("date") as string) || undefined,
        eventId: (formData.get("eventId") as string) || null,
        eraId: (formData.get("eraId") as string) || null,
    };

    const data = createArtifactSchema.parse(raw);

    await db.insert(artifacts).values({
        userId,
        ...data,
    });

    revalidatePath("/app/artifacts");
    revalidatePath("/app/dashboard");
}

export async function updateArtifact(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        type: (formData.get("type") as string) || undefined,
        url: (formData.get("url") as string) || undefined,
        caption: (formData.get("caption") as string) || undefined,
        date: (formData.get("date") as string) || undefined,
        eventId: formData.has("eventId")
            ? (formData.get("eventId") as string) || null
            : undefined,
        eraId: formData.has("eraId")
            ? (formData.get("eraId") as string) || null
            : undefined,
    };

    const data = updateArtifactSchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(artifacts)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(artifacts.id, id), eq(artifacts.userId, userId)));

    revalidatePath("/app/artifacts");
}

export async function deleteArtifact(formData: FormData) {
    const userId = await getUserId();
    const id = formData.get("id") as string;

    // Get the artifact to delete the file from storage
    const [artifact] = await db
        .select()
        .from(artifacts)
        .where(and(eq(artifacts.id, id), eq(artifacts.userId, userId)));

    if (artifact) {
        // Try to delete from storage if it's a stored file
        try {
            const url = new URL(artifact.url);
            const pathMatch = url.pathname.match(
                /\/storage\/v1\/object\/public\/artifacts\/(.+)$/
            );
            if (pathMatch) {
                const supabase = await createClient();
                await supabase.storage
                    .from("artifacts")
                    .remove([pathMatch[1]]);
            }
        } catch {
            // External URL, no storage cleanup needed
        }

        await db
            .delete(artifacts)
            .where(and(eq(artifacts.id, id), eq(artifacts.userId, userId)));
    }

    revalidatePath("/app/artifacts");
}
