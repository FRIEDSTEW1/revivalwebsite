import { useMemo, useState } from "react"
import { Clock } from "lucide-react"
import type { ClassCategory, TimetableEntry, Weekday } from "@/lib/types"
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

const AGE_FILTERS: { value: ClassCategory | "all"; label: string }[] = [
  { value: "all", label: "All ages" },
  { value: "kids", label: "Kids" },
  { value: "teens", label: "Teens" },
  { value: "adults", label: "Adults" },
]

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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-transparent bg-gold-gradient text-gray-900 shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function TimetableGrid({ entries }: { entries: TimetableEntry[] }) {
  const [ageFilter, setAgeFilter] = useState<ClassCategory | "all">("all")
  const [dayFilter, setDayFilter] = useState<Weekday | "all">("all")

  const activeDays = useMemo(
    () => DAYS.filter((day) => entries.some((e) => e.day === day)),
    [entries]
  )

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          (ageFilter === "all" || e.ageGroup === ageFilter) &&
          (dayFilter === "all" || e.day === dayFilter)
      ),
    [entries, ageFilter, dayFilter]
  )

  const byDay = useMemo(() => {
    const groups = new Map<Weekday, TimetableEntry[]>()
    for (const day of DAYS) {
      const dayEntries = filtered
        .filter((e) => e.day === day)
        .sort((a, b) => startMinutes(a.time) - startMinutes(b.time))
      if (dayEntries.length > 0) groups.set(day, dayEntries)
    }
    return groups
  }, [filtered])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {AGE_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              active={ageFilter === f.value}
              onClick={() => setAgeFilter(f.value)}
            >
              {f.label}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={dayFilter === "all"} onClick={() => setDayFilter("all")}>
            All days
          </FilterChip>
          {activeDays.map((d) => (
            <FilterChip key={d} active={dayFilter === d} onClick={() => setDayFilter(d)}>
              {d.slice(0, 3)}
            </FilterChip>
          ))}
        </div>
      </div>

      {byDay.size === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No classes match these filters.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from(byDay.entries()).map(([day, dayEntries]) => (
            <section
              key={day}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
                <h3 className="font-serif text-lg font-bold">{day}</h3>
                <span className="text-xs font-medium text-muted-foreground">
                  {dayEntries.length} {dayEntries.length === 1 ? "class" : "classes"}
                </span>
              </header>

              <ul className="divide-y divide-border">
                {dayEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{entry.className}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {entry.time}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                        entry.ageGroup === "kids"
                          ? "bg-gold/15 text-gold-dark dark:text-gold"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {entry.ageGroup}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
