"use server";

import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { culturalInfluences, eras } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { createInfluenceSchema, updateInfluenceSchema } from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getInfluences() {
    const userId = await getUserId();
    return db
        .select({
            influence: culturalInfluences,
            eraName: eras.name,
        })
        .from(culturalInfluences)
        .leftJoin(eras, eq(culturalInfluences.eraId, eras.id))
        .where(eq(culturalInfluences.userId, userId))
        .orderBy(desc(culturalInfluences.createdAt));
}

export async function getInfluence(id: string) {
    const userId = await getUserId();
    const [result] = await db
        .select({
            influence: culturalInfluences,
            eraName: eras.name,
        })
        .from(culturalInfluences)
        .leftJoin(eras, eq(culturalInfluences.eraId, eras.id))
        .where(
            and(
                eq(culturalInfluences.id, id),
                eq(culturalInfluences.userId, userId)
            )
        );
    return result ?? null;
}

export async function createInfluence(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        category: formData.get("category") as string,
        name: formData.get("name") as string,
        eraId: (formData.get("eraId") as string) || null,
        ageOrYear: (formData.get("ageOrYear") as string) || undefined,
        whyItMattered: (formData.get("whyItMattered") as string) || undefined,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
    };

    const data = createInfluenceSchema.parse(raw);

    await db.insert(culturalInfluences).values({
        userId,
        ...data,
    });

    revalidatePath("/app/influences");
    revalidatePath("/app/dashboard");
}

export async function updateInfluence(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        category: (formData.get("category") as string) || undefined,
        name: (formData.get("name") as string) || undefined,
        eraId: formData.has("eraId")
            ? (formData.get("eraId") as string) || null
            : undefined,
        ageOrYear: (formData.get("ageOrYear") as string) || undefined,
        whyItMattered: (formData.get("whyItMattered") as string) || undefined,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
    };

    const data = updateInfluenceSchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(culturalInfluences)
        .set({ ...updates, updatedAt: new Date() })
        .where(
            and(
                eq(culturalInfluences.id, id),
                eq(culturalInfluences.userId, userId)
            )
        );

    revalidatePath("/app/influences");
}

export async function deleteInfluence(formData: FormData) {
    const userId = await getUserId();
    const id = formData.get("id") as string;

    await db
        .delete(culturalInfluences)
        .where(
            and(
                eq(culturalInfluences.id, id),
                eq(culturalInfluences.userId, userId)
            )
        );

    revalidatePath("/app/influences");
}
