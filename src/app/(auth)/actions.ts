"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { data: authData, error } =
        await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    // Ensure profile exists (in case it wasn't created during signup)
    if (authData.user) {
        await db
            .insert(profiles)
            .values({
                id: authData.user.id,
                email: authData.user.email!,
                displayName:
                    authData.user.user_metadata?.display_name ?? null,
            })
            .onConflictDoNothing();
    }

    revalidatePath("/", "layout");
    redirect("/app/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName,
            },
        },
    });

    if (error) {
        redirect("/signup?error=" + encodeURIComponent(error.message));
    }

    // If email confirmation is required, the user won't have a session yet
    // but we still have the user object
    if (authData.user) {
        await db
            .insert(profiles)
            .values({
                id: authData.user.id,
                email,
                displayName,
            })
            .onConflictDoNothing();
    }

    // If email confirmation is enabled and no session, redirect to a message
    if (!authData.session) {
        redirect(
            "/login?error=" +
            encodeURIComponent(
                "Check your email to confirm your account before signing in.",
            ),
        );
    }

    revalidatePath("/", "layout");
    redirect("/app/dashboard");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
