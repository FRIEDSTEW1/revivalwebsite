import { useMemo, useState } from "react"
import type { ClassCategory, TimetableEntry, Weekday } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DAYS: Weekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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

export function TimetableGrid({ entries }: { entries: TimetableEntry[] }) {
  const [ageFilter, setAgeFilter] = useState<ClassCategory | "all">("all")
  const [dayFilter, setDayFilter] = useState<Weekday | "all">("all")

  const activeDays = useMemo(
    () => DAYS.filter((day) => entries.some((e) => e.day === day)),
    [entries]
  )

  const filtered = useMemo(() => {
    return entries.filter(
      (e) =>
        (ageFilter === "all" || e.ageGroup === ageFilter) &&
        (dayFilter === "all" || e.day === dayFilter)
    )
  }, [entries, ageFilter, dayFilter])

  const byDay = useMemo(() => {
    const groups = new Map<Weekday, TimetableEntry[]>()
    for (const day of DAYS) {
      const dayEntries = filtered.filter((e) => e.day === day).sort((a, b) => startMinutes(a.time) - startMinutes(b.time))
      if (dayEntries.length > 0) groups.set(day, dayEntries)
    }
    return groups
  }, [filtered])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {AGE_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={ageFilter === f.value ? "default" : "outline"}
              onClick={() => setAgeFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={dayFilter === "all" ? "default" : "outline"}
            onClick={() => setDayFilter("all")}
          >
            All days
          </Button>
          {activeDays.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dayFilter === d ? "default" : "outline"}
              onClick={() => setDayFilter(d)}
            >
              {d.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      {byDay.size === 0 && (
        <p className="text-sm text-muted-foreground">No classes match these filters.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(byDay.entries()).map(([day, dayEntries]) => (
          <div key={day} className="rounded-lg border border-border">
            <h3 className="border-b border-border bg-muted/50 px-4 py-3 font-serif text-lg font-semibold">
              {day}
            </h3>
            <ul className="divide-y divide-border">
              {dayEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{entry.className}</p>
                    <p className="text-xs text-muted-foreground">{entry.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      entry.ageGroup === "kids" && "border-primary/40",
                    )}
                  >
                    {entry.ageGroup}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
