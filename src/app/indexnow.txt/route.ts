export const dynamic = "force-static"

import { INDEXNOW_KEY } from "@/lib/seo/indexnow"

/** IndexNow key file (see lib/seo/indexnow.ts). */
export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
