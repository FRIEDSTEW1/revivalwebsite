import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager"
import { PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, createRow, updateRow, deleteRow, persistOrder } from "@/lib/adminApi"
import type { TeamMember } from "@/lib/types"

const fields: FieldConfig[] = [
  { key: "name", label: "Full Name", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "specialties", label: "Specialties", type: "list" },
  { key: "experience", label: "Years Experience", type: "number" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "image", label: "Photo", type: "image", folder: "team" },
]

function toRow(values: Record<string, string>) {
  return {
    name: values.name,
    role: values.role,
    specialties: values.specialties.split(",").map((s) => s.trim()).filter(Boolean),
    experience: values.experience,
    bio: values.bio,
    image: values.image,
  }
}

export function ManageTeam() {
  const { items, loading, error, refetch } = useRefetchableList<TeamMember>(() =>
    fetchAll("team_members", "order")
  )

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <ResourceManager<TeamMember>
      title="Team Members"
      items={items}
      fields={fields}
      orderable
      onReorder={async (ids) => {
        await persistOrder("team_members", ids)
        await refetch()
      }}
      renderRow={(m) => (
        <div>
          <p className="font-medium">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.role}</p>
        </div>
      )}
      toFormValues={(m) => ({
        name: m.name,
        role: m.role,
        specialties: m.specialties.join(", "),
        experience: m.experience,
        bio: m.bio,
        image: m.image,
      })}
      onCreate={async (values) => {
        await createRow("team_members", { ...toRow(values), order: items.length })
        await refetch()
      }}
      onUpdate={async (id, values) => {
        await updateRow("team_members", id, toRow(values))
        await refetch()
      }}
      onDelete={async (id) => {
        await deleteRow("team_members", id)
        await refetch()
      }}
    />
  )
}
