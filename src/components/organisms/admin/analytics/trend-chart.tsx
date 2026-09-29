"use client"

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

import { formatCount, shortDate } from "@/lib/utils/analytics"

type Point = { date: string; value: number }

type TrendChartProps = {
  title: string
  description?: string
  /** Unit in the tooltip and table, e.g. "pengunjung". */
  unit: string
  data: Point[]
}

const HEIGHT = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 40 }
const COLOR = "#7c3aed" // brand-600 — validated: lightness, chroma, 3:1 vs surface

const TICK_COUNT = 4

/**
 * Smallest clean integer step at or above max/4, so the four gridlines land on
 * round numbers and the line still fills most of the plot height.
 */
function niceStep(max: number) {
  const raw = Math.max(1, max / TICK_COUNT)
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => s * pow >= raw && Number.isInteger(s * pow)) ?? 10
  return step * pow
}

/**
 * Single-series area chart (one hue, 10% wash, 2px line) with a snapping
 * crosshair + tooltip on hover and arrow-key focus, and a table view.
 */
export function TrendChart({ title, description, unit, data }: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  const [active, setActive] = useState<number | null>(null)
  const id = useId()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const total = data.reduce((sum, p) => sum + p.value, 0)
  const step = niceStep(Math.max(0, ...data.map((p) => p.value)))
  const max = step * TICK_COUNT
  const innerW = width - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom

  const points = useMemo(
    () =>
      data.map((p, i) => ({
        ...p,
        x: PAD.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2),
        y: PAD.top + innerH - (p.value / max) * innerH,
      })),
    [data, innerW, innerH, max],
  )

  const line = points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
  const area = points.length ? `${line} L${points.at(-1)!.x.toFixed(1)},${PAD.top + innerH} L${points[0].x.toFixed(1)},${PAD.top + innerH} Z` : ""
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step)
  // First, middle and last date keep the axis readable at any width.
  const xLabels = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])].filter((i) => points[i])

  const nearest = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left
    let best = 0
    points.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(points[best].x - x)) best = i
    })
    return best
  }

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) =>
    setActive(nearest(event.clientX, event.currentTarget.getBoundingClientRect()))

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!points.length) return
    const current = active ?? points.length - 1
    if (event.key === "ArrowLeft") setActive(Math.max(0, current - 1))
    else if (event.key === "ArrowRight") setActive(Math.min(points.length - 1, current + 1))
    else if (event.key === "Home") setActive(0)
    else if (event.key === "End") setActive(points.length - 1)
    else return
    event.preventDefault()
  }

  const hovered = active !== null ? points[active] : null

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 id={`${id}-title`} className="text-base font-bold text-ink">
            {title}
          </h3>
          {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
        </div>
        <p className="text-sm text-ink-muted">
          Total <span className="font-bold text-ink tabular-nums">{formatCount(total)}</span>
        </p>
      </header>

      <div ref={containerRef} className="relative">
        {total === 0 ? (
          <div className="grid h-[220px] place-items-center rounded-2xl bg-surface-soft text-center text-sm text-ink-muted">
            Belum ada data untuk periode ini.
          </div>
        ) : (
          <>
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              aria-labelledby={`${id}-title`}
              aria-describedby={`${id}-hint`}
              tabIndex={0}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setActive(null)}
              onKeyDown={onKeyDown}
              onBlur={() => setActive(null)}
              className="block touch-pan-y rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
            >
              {ticks.map((t) => {
                const y = PAD.top + innerH - (t / max) * innerH
                return (
                  <g key={t}>
                    <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} stroke="#ece8f5" strokeWidth={1} />
                    <text x={PAD.left - 8} y={y} dy="0.32em" textAnchor="end" className="fill-ink-muted text-[11px] tabular-nums">
                      {formatCount(t)}
                    </text>
                  </g>
                )
              })}
              {xLabels.map((i) => (
                <text
                  key={i}
                  x={points[i].x}
                  y={HEIGHT - 8}
                  textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                  className="fill-ink-muted text-[11px]"
                >
                  {shortDate(points[i].date)}
                </text>
              ))}

              <path d={area} fill={COLOR} fillOpacity={0.1} />
              <path d={line} fill="none" stroke={COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

              {hovered ? (
                <g>
                  <line x1={hovered.x} x2={hovered.x} y1={PAD.top} y2={PAD.top + innerH} stroke="#c4b5fd" strokeWidth={1} />
                  <circle cx={hovered.x} cy={hovered.y} r={5} fill={COLOR} stroke="#ffffff" strokeWidth={2} />
                </g>
              ) : (
                // End marker anchors the latest value when nothing is hovered.
                <circle cx={points.at(-1)!.x} cy={points.at(-1)!.y} r={4} fill={COLOR} stroke="#ffffff" strokeWidth={2} />
              )}
            </svg>

            {hovered ? (
              <div
                role="status"
                className="pointer-events-none absolute top-2 z-10 flex -translate-x-1/2 flex-col rounded-xl bg-white px-3 py-2 text-xs shadow-lift ring-1 ring-line"
                style={{ left: Math.min(Math.max(hovered.x, 70), width - 70) }}
              >
                <span className="text-base font-bold text-ink tabular-nums">{formatCount(hovered.value)}</span>
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: COLOR }} />
                  {unit} · {shortDate(hovered.date)}
                </span>
              </div>
            ) : null}
            <p id={`${id}-hint`} className="sr-only">
              Gunakan panah kiri dan kanan untuk membaca nilai per hari.
            </p>
          </>
        )}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer font-semibold text-brand-700 hover:underline">Lihat data tabel</summary>
        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl ring-1 ring-line">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface-soft text-xs text-ink-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Tanggal</th>
                <th className="px-3 py-2 text-right font-semibold capitalize">{unit}</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((p) => (
                <tr key={p.date} className="border-t border-line">
                  <td className="px-3 py-1.5">{shortDate(p.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatCount(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}
