"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Toaster as Sonner, toast } from "sonner"

/** Toasts for the admin, styled with the brand tokens. */
export function AdminToaster() {
  return (
    <Sonner
      theme="light"
      position="top-right"
      closeButton
      richColors
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border !border-line !shadow-lift !font-sans",
          title: "!font-semibold",
        },
      }}
    />
  )
}

const notices: Record<string, { type: "success" | "error"; message: string }> = {
  saved: { type: "success", message: "Perubahan tersimpan dan website sudah diperbarui." },
  created: { type: "success", message: "Data baru berhasil ditambahkan." },
  deleted: { type: "success", message: "Data berhasil dihapus." },
  forbidden: { type: "error", message: "Menu itu hanya untuk Admin." },
}

/**
 * Shows a toast for `?notice=` set by a server-action redirect, then removes
 * the parameter so a refresh doesn't show it again.
 */
export function NoticeToast() {
  const params = useSearchParams()
  const notice = params.get("notice")

  useEffect(() => {
    if (!notice) return
    const entry = notices[notice]
    if (entry) toast[entry.type](entry.message)

    // history.replaceState updates the URL without re-requesting the page from the server.
    const url = new URL(window.location.href)
    url.searchParams.delete("notice")
    window.history.replaceState(null, "", url)
  }, [notice])

  return null
}
