import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, deleteRow } from "@/lib/adminApi"

interface ContactRow {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export function Messages() {
  const { items, loading, error, refetch } = useRefetchableList<ContactRow>(() =>
    fetchAll("contact_submissions", "created_at")
  )

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return
    try {
      await deleteRow("contact_submissions", id)
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-semibold">Messages</h2>
      {items.length === 0 && <PageEmpty message="No messages yet." />}
      {items.map((m) => (
        <Card key={m.id} className="flex items-start justify-between gap-4 p-4">
          <div>
            <p className="font-medium">{m.name} · <span className="font-normal text-muted-foreground">{m.email}</span></p>
            {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
            <p className="mt-2 text-sm">{m.message}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  )
}
