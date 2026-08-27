import { SEO } from "@/components/SEO"
import { TimetableGrid } from "@/components/TimetableGrid"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getTimetable } from "@/lib/data"

export function Timetable() {
  const { data: entries, loading, error } = useAsync(getTimetable)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SEO
        title="Timetable"
        description="Plan your training schedule. All times are UK local time."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Class Timetable</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Plan your training schedule. All times are UK local time.
        </p>
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {entries && entries.length === 0 && <PageEmpty message="Schedule coming soon!" />}
      {entries && entries.length > 0 && <TimetableGrid entries={entries} />}
    </div>
  )
}
