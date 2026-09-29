"use client"

import { cn } from "cn"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/atoms/logo"
import { WhatsAppButton } from "@/components/molecules/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useScrolled } from "@/hooks/use-scrolled"
import { navItems } from "@/lib/content/site"

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname()
  const scrolled = useScrolled()

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 rounded-full border bg-white/95 pr-2 pl-4 transition-shadow duration-300 supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150 sm:pl-5",
          scrolled ? "border-white/70 shadow-soft" : "border-transparent shadow-[0_8px_24px_rgb(76_29_149/0.06)]",
        )}
      >
        <Link href="/" className="rounded-full">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                      active ? "text-brand-700" : "text-ink hover:text-brand-700",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton href={whatsappHref} size="sm" className="sm:hidden">
            WhatsApp
          </WhatsAppButton>
          <WhatsAppButton href={whatsappHref} className="shine hidden sm:inline-flex">
            Chat WhatsApp
          </WhatsAppButton>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">Buka menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] max-w-sm gap-0 rounded-l-[var(--radius-card)] p-0">
              <SheetHeader className="border-b border-line p-6">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">Menu navigasi situs</SheetDescription>
              </SheetHeader>
              <nav aria-label="Navigasi seluler" className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-1">
                  {[...navItems, { href: "/rental", label: "Sewa Studio" }].map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex h-12 items-center rounded-2xl px-4 text-base font-semibold",
                                active ? "bg-brand-50 text-brand-800" : "text-ink hover:bg-brand-50",
                              )}
                            />
                          }
                        >
                          {item.label}
                        </SheetClose>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className="flex flex-col gap-3 border-t border-line p-6">
                <WhatsAppButton href={whatsappHref} size="lg">
                  Chat WhatsApp
                </WhatsAppButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
