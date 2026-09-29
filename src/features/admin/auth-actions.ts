"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { formValues, type FormState } from "@/lib/forms"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"

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

  const next = typeof values.next === "string" && values.next.startsWith("/admin") ? values.next : "/admin"
  redirect(next)
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient()
    await supabase.auth.signOut()
  }
  redirect("/admin/login")
}
