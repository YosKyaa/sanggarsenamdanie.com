/** Where to continue after login: only admin pages, never back to login or off-site (no open redirects). */
export function safeNext(next: unknown): string {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin"
}
