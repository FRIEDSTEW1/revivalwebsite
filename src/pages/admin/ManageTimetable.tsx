import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager"
import { PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, createRow, updateRow, deleteRow } from "@/lib/adminApi"
import type { TimetableEntry } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const fields: FieldConfig[] = [
  { key: "day", label: "Day", type: "select", options: DAYS },
  { key: "time", label: "Time (e.g. 6:00 PM - 7:00 PM)", type: "text" },
  { key: "className", label: "Class Name", type: "text" },
  { key: "ageGroup", label: "Age Group", type: "select", options: ["kids", "teens", "adults"] },
]

function toRow(values: Record<string, string>) {
  return {
    day: values.day,
    time: values.time,
    className: values.className,
    ageGroup: values.ageGroup,
  }
}

export function ManageTimetable() {
  const { items, loading, error, refetch } = useRefetchableList<TimetableEntry>(() =>
    fetchAll("timetable_entries")
  )

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <ResourceManager<TimetableEntry>
      title="Timetable Entries"
      items={items}
      fields={fields}
      renderRow={(t) => (
        <div>
          <p className="font-medium">{t.className}</p>
          <p className="text-xs text-muted-foreground">{t.day} · {t.time} · {t.ageGroup}</p>
        </div>
      )}
      toFormValues={(t) => ({
        day: t.day,
        time: t.time,
        className: t.className,
        ageGroup: t.ageGroup,
      })}
      onCreate={async (values) => {
        await createRow("timetable_entries", toRow(values))
        await refetch()
      }}
      onUpdate={async (id, values) => {
        await updateRow("timetable_entries", id, toRow(values))
        await refetch()
      }}
      onDelete={async (id) => {
        await deleteRow("timetable_entries", id)
        await refetch()
      }}
    />
  )
}
