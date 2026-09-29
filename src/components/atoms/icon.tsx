import {
  Activity,
  Droplets,
  Dumbbell,
  Flower2,
  HeartPulse,
  Music,
  Sparkles,
  Waves,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

/** Icons selectable from the CMS (programs.icon). Unknown keys fall back to Activity. */
export const programIcons = {
  activity: Activity,
  "heart-pulse": HeartPulse,
  music: Music,
  flower: Flower2,
  waves: Waves,
  droplets: Droplets,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>

export type ProgramIconName = keyof typeof programIcons

export function ProgramIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = programIcons[name as ProgramIconName] ?? Activity
  return <Icon aria-hidden {...props} />
}
