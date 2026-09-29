import { ImageResponse } from "next/og"

import { brandFigurePath } from "@/components/atoms/logo"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** Home-screen / bookmark icon: the logo mark on brand purple. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#6D28D9", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="4 3 32 32" width="128" height="128">
          <circle cx="24.5" cy="10.5" r="3.5" fill="#DDD6FE" />
          <path d={brandFigurePath} fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  )
}
