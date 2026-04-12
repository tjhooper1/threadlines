"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { eras } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { createEraSchema, updateEraSchema } from "@/lib/validators";

async function getUserId() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user.id;
}

export async function getEras() {
    const userId = await getUserId();
    return db
        .select()
        .from(eras)
        .where(eq(eras.userId, userId))
        .orderBy(eras.sortOrder, desc(eras.createdAt));
}

export async function getEra(id: string) {
    const userId = await getUserId();
    const [era] = await db
        .select()
        .from(eras)
        .where(and(eq(eras.id, id), eq(eras.userId, userId)));
    return era ?? null;
}

export async function createEra(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        name: formData.get("name") as string,
        startDate: (formData.get("startDate") as string) || undefined,
        endDate: (formData.get("endDate") as string) || undefined,
        summary: (formData.get("summary") as string) || undefined,
        definingTraits: formData.get("definingTraits")
            ? JSON.parse(formData.get("definingTraits") as string)
            : [],
        lessonLearned: (formData.get("lessonLearned") as string) || undefined,
    };

    const data = createEraSchema.parse(raw);

    await db.insert(eras).values({
        userId,
        ...data,
    });

    revalidatePath("/app/eras");
    redirect("/app/eras");
}

export async function updateEra(formData: FormData) {
    const userId = await getUserId();

    const raw = {
        id: formData.get("id") as string,
        name: (formData.get("name") as string) || undefined,
        startDate: (formData.get("startDate") as string) || undefined,
        endDate: (formData.get("endDate") as string) || undefined,
        summary: (formData.get("summary") as string) || undefined,
        definingTraits: formData.get("definingTraits")
            ? JSON.parse(formData.get("definingTraits") as string)
            : undefined,
        lessonLearned: (formData.get("lessonLearned") as string) || undefined,
    };

    const data = updateEraSchema.parse(raw);
    const { id, ...updates } = data;

    await db
        .update(eras)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(eras.id, id), eq(eras.userId, userId)));

    revalidatePath("/app/eras");
    redirect("/app/eras");
}

export async function deleteEra(formData: FormData) {
    const userId = await getUserId();
    const id = formData.get("id") as string;

    await db
        .delete(eras)
        .where(and(eq(eras.id, id), eq(eras.userId, userId)));

    revalidatePath("/app/eras");
}
