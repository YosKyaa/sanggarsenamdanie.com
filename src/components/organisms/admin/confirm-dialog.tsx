"use client"

import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react"
import { useTransition, type ReactNode } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ActionResult } from "@/lib/forms"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel?: string
  /** "danger" for irreversible actions (delete), "default" for other decisions. */
  tone?: "danger" | "default"
  /**
   * Runs on confirm. Return an ActionResult to get a toast automatically;
   * return nothing when the action redirects or handles feedback itself.
   */
  onConfirm: () => Promise<ActionResult | void> | ActionResult | void
  /** Called after a successful result (e.g. navigate away). */
  onSuccess?: () => void
}

/** The one confirmation dialog used for every decision in the admin. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ya, lanjutkan",
  tone = "default",
  onConfirm,
  onSuccess,
}: ConfirmDialogProps) {
  const [pending, startTransition] = useTransition()
  const Icon = tone === "danger" ? AlertTriangle : HelpCircle

  const confirm = () =>
    startTransition(async () => {
      const result = await onConfirm()
      if (!result) return
      if (result.ok) {
        toast.success(result.message)
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(result.message)
      }
    })

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md" showCloseButton={!pending}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className={
                tone === "danger"
                  ? "grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-700"
                  : "grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700"
              }
            >
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-1.5 pt-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" disabled={pending} />}>Batal</DialogClose>
          <Button
            onClick={confirm}
            disabled={pending}
            className={tone === "danger" ? "bg-red-700 text-white shadow-none hover:bg-red-800" : undefined}
          >
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            {pending ? "Memproses…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
