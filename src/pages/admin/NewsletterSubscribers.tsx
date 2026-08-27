import { Download, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, deleteRow } from "@/lib/adminApi"
import type { NewsletterRow } from "@/lib/types"

function downloadCsv(items: NewsletterRow[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const rows = [
    "email,subscribed_at",
    ...items.map((i) => `${escape(i.email)},${escape(i.created_at)}`),
  ]
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function NewsletterSubscribers() {
  const { items, loading, error, refetch } = useRefetchableList<NewsletterRow>(() =>
    fetchAll("newsletter_subscribers", "created_at", { ascending: false })
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
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Newsletter Subscribers</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={items.length === 0}
          onClick={() => downloadCsv(items)}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {items.length === 0 && <PageEmpty message="No subscribers yet." />}
      {items.map((s) => (
        <Card key={s.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium">{s.email}</p>
            <p className="text-xs text-muted-foreground">
              Subscribed {new Date(s.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  )
}
