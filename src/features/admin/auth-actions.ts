"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { site } from "@/lib/content/site"
import { formValues, type FormState } from "@/lib/forms"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"

import { safeNext } from "./next-path"

const loginSchema = z.object({
  email: z.email("Masukkan email yang valid."),
  password: z.string().min(1, "Masukkan kata sandi."),
})

export async function signIn(_prev: FormState<"email">, formData: FormData): Promise<FormState<"email">> {
  const values = formValues(formData)
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) {
    return { status: "error", message: "Email dan kata sandi wajib diisi.", values: { email: values.email } }
  }
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase belum dikonfigurasi. Isi variabel lingkungan terlebih dahulu." }
  }

  const supabase = await createSessionClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    return { status: "error", message: "Email atau kata sandi salah.", values: { email: values.email } }
  }

  redirect(safeNext(values.next))
}

/**
 * Starts Google sign-in. Google returns to /auth/callback, which only lets
 * accounts an admin registered (same email) into the panel.
 */
export async function signInWithGoogle(formData: FormData) {
  if (!isSupabaseConfigured) redirect("/admin/login?error=oauth")

  // Return to the host the visitor is on (production, preview or localhost).
  const origin = (await headers()).get("origin") ?? site.url
  const next = safeNext(formData.get("next"))

  const supabase = await createSessionClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // Let people with several Google accounts pick the right one.
      queryParams: { prompt: "select_account" },
    },
  })
  if (error || !data.url) redirect("/admin/login?error=oauth")
  redirect(data.url)
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient()
    await supabase.auth.signOut()
  }
  redirect("/admin/login")
}
