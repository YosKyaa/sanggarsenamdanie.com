import type { NextConfig } from "next"

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null

// Canonical URLs, sitemap and Open Graph all derive from this. Shipping without
// it would point search engines at localhost, so make a production build say so.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    [
      "",
      "⚠️  NEXT_PUBLIC_SITE_URL is not set — canonical URLs and the sitemap will use http://localhost:3000.",
      "   Set it to the live domain (e.g. https://sanggarsenamdanie.id) before deploying.",
      "",
    ].join("\n"),
  )
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Only Supabase Storage public objects may be optimised as remote images.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    // Admin uploads go through server actions; allow photos/certificate scans up to 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig
