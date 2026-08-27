import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, deleteRow } from "@/lib/adminApi"

interface SubscriberRow {
  id: string
  email: string
  created_at: string
}

export function NewsletterSubscribers() {
  const { items, loading, error, refetch } = useRefetchableList<SubscriberRow>(() =>
    fetchAll("newsletter_subscribers", "created_at")
  )

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return
    try {
      await deleteRow("newsletter_subscribers", id)
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-semibold">Newsletter Subscribers</h2>
      {items.length === 0 && <PageEmpty message="No subscribers yet." />}
      {items.map((s) => (
        <Card key={s.id} className="flex items-center justify-between gap-4 p-4">
          <p className="text-sm">{s.email}</p>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  )
}
