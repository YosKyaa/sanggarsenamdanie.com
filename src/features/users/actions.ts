"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdmin } from "@/features/admin/auth"
import { formValues, type ActionResult, type FormState } from "@/lib/forms"
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/admin"
import { fieldErrorsOf } from "@/lib/validation"
import type { ProfileRole } from "@/types/database"

const roles = ["admin", "editor", "member"] as const satisfies readonly ProfileRole[]
const MISSING_KEY = "Fitur ini butuh SUPABASE_SERVICE_ROLE_KEY di pengaturan server (Vercel)."

const passwordSchema = z
  .string()
  .min(8, "Minimal 8 karakter.")
  .max(72, "Maksimal 72 karakter.")
  .regex(/[A-Za-z]/, "Harus mengandung huruf.")
  .regex(/[0-9]/, "Harus mengandung angka.")

const createSchema = z.object({
  name: z.string().trim().min(2, "Minimal 2 huruf.").max(80),
  email: z.email("Masukkan email yang valid.").trim().toLowerCase(),
  password: passwordSchema,
  role: z.enum(roles),
})

type CreateField = keyof z.infer<typeof createSchema>

/** Admin count, so the last admin can never be demoted or deleted. */
async function adminCount(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]) {
  const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin")
  return count ?? 0
}

async function roleOf(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], id: string) {
  const { data } = await supabase.from("profiles").select("role").eq("id", id).maybeSingle()
  return data?.role as ProfileRole | undefined
}

export async function createUser(_prev: FormState<CreateField>, formData: FormData): Promise<FormState<CreateField>> {
  const { supabase } = await requireAdmin()
  const values = formValues(formData)
  if (!isServiceRoleConfigured) return { status: "error", message: MISSING_KEY, values }

  const parsed = createSchema.safeParse(values)
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian.", fieldErrors: fieldErrorsOf(parsed.error), values }
  }
  const { name, email, password, role } = parsed.data

  // Accounts made by an admin are confirmed immediately — no verification email.
  const { data, error } = await createServiceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })
  if (error || !data.user) {
    const taken = error?.message.toLowerCase().includes("already")
    return {
      status: "error",
      message: taken ? "Email ini sudah terdaftar." : `Gagal membuat akun: ${error?.message}`,
      fieldErrors: taken ? { email: "Email ini sudah terdaftar." } : undefined,
      values,
    }
  }

  // The signup trigger creates the profile as "member"; set the chosen role.
  const { error: roleError } = await supabase.from("profiles").update({ name, role }).eq("id", data.user.id)
  revalidatePath("/admin/users")
  if (roleError) {
    return { status: "error", message: `Akun dibuat, tetapi peran gagal disimpan: ${roleError.message}. Ubah peran dari daftar.` }
  }
  return { status: "success", message: `Akun ${email} berhasil dibuat.` }
}

export async function updateUserRole(id: string, role: ProfileRole): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin()
  if (!roles.includes(role)) return { ok: false, message: "Peran tidak dikenal." }
  if (id === user.id) return { ok: false, message: "Anda tidak bisa mengubah peran akun Anda sendiri." }

  if ((await roleOf(supabase, id)) === "admin" && role !== "admin" && (await adminCount(supabase)) <= 1) {
    return { ok: false, message: "Harus ada minimal satu Admin." }
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id)
  if (error) return { ok: false, message: `Gagal mengubah peran: ${error.message}` }

  revalidatePath("/admin/users")
  return { ok: true, message: "Peran pengguna diperbarui." }
}

export async function resetUserPassword(id: string, password: string): Promise<ActionResult> {
  await requireAdmin()
  if (!isServiceRoleConfigured) return { ok: false, message: MISSING_KEY }

  const parsed = passwordSchema.safeParse(password)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Password tidak valid." }

  const { error } = await createServiceClient().auth.admin.updateUserById(id, { password: parsed.data })
  if (error) return { ok: false, message: `Gagal mengganti password: ${error.message}` }
  return { ok: true, message: "Password berhasil diganti. Berikan password baru ke pengguna tersebut." }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin()
  if (!isServiceRoleConfigured) return { ok: false, message: MISSING_KEY }
  if (id === user.id) return { ok: false, message: "Anda tidak bisa menghapus akun Anda sendiri." }

  if ((await roleOf(supabase, id)) === "admin" && (await adminCount(supabase)) <= 1) {
    return { ok: false, message: "Harus ada minimal satu Admin." }
  }

  // Deleting the auth user cascades to the profile.
  const { error } = await createServiceClient().auth.admin.deleteUser(id)
  if (error) return { ok: false, message: `Gagal menghapus akun: ${error.message}` }

  revalidatePath("/admin/users")
  return { ok: true, message: "Akun berhasil dihapus." }
}
