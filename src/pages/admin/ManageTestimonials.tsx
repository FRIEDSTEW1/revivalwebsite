import { Star } from "lucide-react"
import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager"
import { PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, createRow, updateRow, deleteRow } from "@/lib/adminApi"
import type { Testimonial } from "@/lib/types"

const fields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "role", label: "Role (e.g. Parent, Student)", type: "text" },
  { key: "content", label: "Review", type: "textarea" },
  { key: "rating", label: "Rating", type: "select", options: ["5", "4", "3", "2", "1"] },
  { key: "image", label: "Photo", type: "image", folder: "testimonials" },
]

function toRow(values: Record<string, string>) {
  return {
    name: values.name,
    role: values.role,
    content: values.content,
    rating: Number(values.rating) || 5,
    image: values.image,
  }
}

export function ManageTestimonials() {
  const { items, loading, error, refetch } = useRefetchableList<Testimonial>(() =>
    fetchAll("testimonials", "name")
  )

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <ResourceManager<Testimonial>
      title="Testimonials"
      items={items}
      fields={fields}
      renderRow={(t) => (
        <div>
          <p className="font-medium">{t.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {t.role}
            <span className="mx-1">·</span>
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </span>
          </p>
        </div>
      )}
      toFormValues={(t) => ({
        name: t.name,
        role: t.role,
        content: t.content,
        rating: String(t.rating),
        image: t.image,
      })}
      onCreate={async (values) => {
        await createRow("testimonials", toRow(values))
        await refetch()
      }}
      onUpdate={async (id, values) => {
        await updateRow("testimonials", id, toRow(values))
        await refetch()
      }}
      onDelete={async (id) => {
        await deleteRow("testimonials", id)
        await refetch()
      }}
    />
  )
}
