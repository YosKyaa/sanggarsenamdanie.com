import { CountUp } from "@/components/atoms/motion"

type StatsCardProps = {
  value: number
  suffix?: string
  label: string
  /** Animate from 0 when scrolled into view. */
  count?: boolean
}

/** One stat inside a <dl>. The label comes first in the DOM (dt before dd) but displays below the number. */
export function StatsCard({ value, suffix, label, count = true }: StatsCardProps) {
  return (
    <div className="group flex flex-col items-center gap-1.5 text-center">
      <dt className="order-2 text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="order-1 text-4xl font-extrabold tracking-tight text-ink tabular-nums transition-transform duration-300 group-hover:-translate-y-1 lg:text-5xl">
        {count ? <CountUp value={value} /> : value}
        {suffix ? <span className="ml-0.5 align-top text-2xl text-brand-600 lg:text-3xl">{suffix}</span> : null}
      </dd>
    </div>
  )
}
