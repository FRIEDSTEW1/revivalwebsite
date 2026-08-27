import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CalendarDays, Clock } from "lucide-react"
import type { ClassCategory, TimetableEntry, Weekday } from "@/lib/types"
import { Reveal } from "@/components/motion/Reveal"
import { cn } from "@/lib/utils"

const DAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

// The timetable data only ever contains kids and adults classes, so those
// are the only filters worth offering — matching the original design.
const FILTERS: { value: ClassCategory | "all"; label: string }[] = [
  { value: "all", label: "All Classes" },
  { value: "kids", label: "Kids" },
  { value: "adults", label: "Adults" },
]

const BADGE: Record<string, string> = {
  kids: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25",
  teens:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
  adults:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25",
}

function startMinutes(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  const [, h, m, period] = match
  let hours = parseInt(h, 10)
  const minutes = parseInt(m, 10)
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0
  return hours * 60 + minutes
}

export function TimetableGrid({ entries }: { entries: TimetableEntry[] }) {
  const [filter, setFilter] = useState<ClassCategory | "all">("all")
  const reduce = useReducedMotion()

  const byDay = useMemo(() => {
    const visible = entries.filter((e) => filter === "all" || e.ageGroup === filter)
    const groups: { day: Weekday; entries: TimetableEntry[] }[] = []
    for (const day of DAYS) {
      const dayEntries = visible
        .filter((e) => e.day === day)
        .sort((a, b) => startMinutes(a.time) - startMinutes(b.time))
      if (dayEntries.length > 0) groups.push({ day, entries: dayEntries })
    }
    return groups
  }, [entries, filter])

  return (
    <div className="flex flex-col gap-10">
      {/* Segmented filter — three toggles, as in the original */}
      <div className="flex justify-center">
        <div
          role="group"
          aria-label="Filter classes by age group"
          className="inline-flex gap-1 rounded-xl border border-border bg-muted/60 p-1.5"
        >
          {FILTERS.map((f) => {
            const active = filter === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active ? "text-gray-900" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="timetable-filter-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-lg bg-gold-gradient shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {byDay.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No classes match this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {byDay.map(({ day, entries: dayEntries }, dayIndex) => (
            <Reveal key={day} as="section" index={Math.min(dayIndex, 3)}>
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                <header className="flex items-center justify-between gap-3 px-6 py-5">
                  <h3 className="flex items-center gap-2.5 font-serif text-xl font-bold">
                    <CalendarDays
                      className="h-5 w-5 text-gold-dark dark:text-gold"
                      strokeWidth={2}
                    />
                    {day}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    {dayEntries.length} {dayEntries.length === 1 ? "class" : "classes"}
                  </span>
                </header>

                <ul className="flex flex-col gap-3 px-4 pb-5 sm:px-6">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {dayEntries.map((entry, i) => (
                      <motion.li
                        key={entry.id}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                        transition={{
                          duration: 0.3,
                          delay: reduce ? 0 : Math.min(i, 6) * 0.035,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="group rounded-lg border border-border bg-card px-5 py-4 transition-all duration-200 hover:border-gold/60 hover:shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="font-serif text-[15px] font-bold">
                            {entry.className}
                          </span>
                          <span
                            className={cn(
                              "rounded border px-2 py-0.5 text-[11px] font-medium",
                              BADGE[entry.ageGroup] ?? BADGE.adults
                            )}
                          >
                            {entry.ageGroup}
                          </span>
                        </div>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-gold-dark dark:text-gold" />
                          {entry.time}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
