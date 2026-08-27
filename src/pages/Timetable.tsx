import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { TimetableGrid } from "@/components/TimetableGrid"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getTimetable } from "@/lib/data"

export function Timetable() {
  const { data: entries, loading, error } = useAsync(getTimetable)

  return (
    <>
      <SEO title="Timetable" description="Plan your training schedule. All times are UK local time." />
      <PageHeader
        eyebrow="Weekly Schedule"
        title="Class Timetable"
        subtitle="Plan your training schedule. All times are UK local time."
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {entries && entries.length === 0 && <PageEmpty message="Schedule coming soon!" />}
        {entries && entries.length > 0 && <TimetableGrid entries={entries} />}
      </div>
    </>
  )
}
