import type { SVGProps } from "react"

export type SocialPlatform = "instagram" | "tiktok" | "facebook" | "youtube"

export const socialLabel: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
}

/**
 * Simplified brand marks (lucide v1 dropped brand icons). Drawn on a 24px
 * grid with currentColor so they inherit text color like the other icons.
 */
export function SocialIcon({ platform, ...props }: SVGProps<SVGSVGElement> & { platform: SocialPlatform }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, ...props }
  switch (platform) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      )
    case "tiktok":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.4 2.6 2.2 4.4 5 4.7" />
        </svg>
      )
    case "facebook":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v3.5H9V21h3.5v-8.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
        </svg>
      )
    case "youtube":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
        </svg>
      )
  }
}
