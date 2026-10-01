import { NextResponse, type NextRequest } from "next/server"

import { safeNext } from "@/features/admin/next-path"
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/admin"
import { createSessionClient } from "@/lib/supabase/server"

/** A Google account counts as "just created by this login" within this window. */
const NEW_ACCOUNT_MS = 5 * 60 * 1000

/**
 * Google sign-in lands here. Supabase links the Google identity to an existing
 * account with the same email, so staff registered under Pengguna get in.
 * Anyone else is signed out again — and the stray account their attempt
 * created is removed, so the user list only ever holds people an admin added.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const fail = (error: string) => NextResponse.redirect(new URL(`/admin/login?error=${error}`, origin))

  const code = searchParams.get("code")
  if (!code) return fail(searchParams.get("error") === "access_denied" ? "cancelled" : "oauth")

  const supabase = await createSessionClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) return fail("oauth")

  const { user } = data
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "editor") {
    await supabase.auth.signOut()

    const onlyGoogle = user.identities?.length === 1 && user.identities[0].provider === "google"
    const justCreated = Date.now() - new Date(user.created_at).getTime() < NEW_ACCOUNT_MS
    if (onlyGoogle && justCreated && (!profile || profile.role === "member") && isServiceRoleConfigured) {
      await createServiceClient()
        .auth.admin.deleteUser(user.id)
        .catch(() => undefined)
    }
    return fail("not_registered")
  }

  return NextResponse.redirect(new URL(safeNext(searchParams.get("next")), origin))
}
