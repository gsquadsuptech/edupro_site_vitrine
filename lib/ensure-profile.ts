import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Garantit la ligne `profiles` d'un utilisateur auth (client service-role).
 *
 * Le trigger `handle_new_user` ne tourne pas toujours (cas documenté côté SaaS
 * dans /api/payments/initialize). Or le SaaS retrouve l'inscrit par
 * `profiles.email` : sans profil, l'inscription gratuite à un cours échouait
 * avec « Failed to process user account ».
 *
 * Idempotent : ne modifie jamais un profil existant, sauf pour renseigner un
 * email absent. Mêmes champs que le filet de sécurité du SaaS. Renvoie l'email
 * du profil, à transmettre au SaaS (comparaison sensible à la casse).
 */
export async function ensureStudentProfile(
    admin: SupabaseClient,
    user: { id: string; email: string; firstName?: string | null; lastName?: string | null },
): Promise<{ error: string | null; email: string }> {
    const email = user.email.trim().toLowerCase()

    const { data: existing, error: readError } = await admin
        .from("profiles")
        .select("id, email")
        .eq("id", user.id)
        .maybeSingle()
    if (readError) return { error: readError.message, email }

    if (!existing) {
        const { error } = await admin.from("profiles").upsert(
            {
                id: user.id,
                email,
                first_name: user.firstName || null,
                last_name: user.lastName || null,
                role: "student",
            },
            { onConflict: "id", ignoreDuplicates: true },
        )
        return { error: error?.message ?? null, email }
    }

    if (!existing.email) {
        const { error } = await admin.from("profiles").update({ email }).eq("id", user.id)
        return { error: error?.message ?? null, email }
    }

    // Email tel qu'enregistré : le SaaS le compare à l'identique.
    return { error: null, email: existing.email as string }
}
