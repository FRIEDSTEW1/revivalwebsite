import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager"
import { PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, createRow, updateRow, deleteRow, persistOrder } from "@/lib/adminApi"
import type { GymClass } from "@/lib/types"

const fields: FieldConfig[] = [
  { key: "name", label: "Class Name", type: "text" },
  { key: "category", label: "Category", type: "select", options: ["kids", "teens", "adults"] },
  { key: "type", label: "Type", type: "text" },
  { key: "ageRange", label: "Age Range", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "benefits", label: "Benefits", type: "list" },
  { key: "image", label: "Image", type: "image", folder: "classes" },
]

function toRow(values: Record<string, string>) {
  return {
    name: values.name,
    category: values.category,
    type: values.type,
    ageRange: values.ageRange,
    description: values.description,
    benefits: values.benefits.split(",").map((s) => s.trim()).filter(Boolean),
    image: values.image,
  }
}

export function ManageClasses() {
  const { items, loading, error, refetch } = useRefetchableList<GymClass>(() =>
    fetchAll("classes", "order")
  )

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <ResourceManager<GymClass>
      title="Classes"
      items={items}
      fields={fields}
      orderable
      onReorder={async (ids) => {
        await persistOrder("classes", ids)
        await refetch()
      }}
      renderRow={(c) => (
        <div>
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.category} · {c.ageRange}</p>
        </div>
      )}
      toFormValues={(c) => ({
        name: c.name,
        category: c.category,
        type: c.type,
        ageRange: c.ageRange,
        description: c.description,
        benefits: c.benefits.join(", "),
        image: c.image,
      })}
      onCreate={async (values) => {
        await createRow("classes", { ...toRow(values), order: items.length })
        await refetch()
      }}
      onUpdate={async (id, values) => {
        await updateRow("classes", id, toRow(values))
        await refetch()
      }}
      onDelete={async (id) => {
        await deleteRow("classes", id)
        await refetch()
      }}
    />
  )
}
