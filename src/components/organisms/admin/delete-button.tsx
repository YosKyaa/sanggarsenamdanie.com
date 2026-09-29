"use client"

import { Trash2 } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/atoms/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** Deletion always asks for confirmation (error prevention). */
export function DeleteButton({ label, onConfirm }: { label: string; onConfirm: () => Promise<void> }) {
  const [pending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2 aria-hidden />
        Hapus
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus {label}?</DialogTitle>
          <DialogDescription>Data yang dihapus tidak bisa dikembalikan dan langsung hilang dari website.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Batal</DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => startTransition(() => onConfirm())}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Menghapus…" : "Ya, hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
