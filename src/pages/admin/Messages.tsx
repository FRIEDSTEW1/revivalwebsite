import { useMemo, useState } from "react"
import { Archive, ArchiveRestore, Circle, CircleCheck, Mail, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, deleteRow, updateRow } from "@/lib/adminApi"
import { cn } from "@/lib/utils"
import type { ContactMessage } from "@/lib/types"

type FilterTab = "unread" | "all" | "archived"

const TABS: { value: FilterTab; label: string }[] = [
  { value: "unread", label: "Unread" },
  { value: "all", label: "All" },
  { value: "archived", label: "Archived" },
]

function replyHref(m: ContactMessage) {
  const subject = encodeURIComponent("Re: your message to Revival MMA")
  const quoted = m.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")
  const body = encodeURIComponent(`Hi ${m.name},\n\n\n\nOn your message:\n${quoted}`)
  return `mailto:${m.email}?subject=${subject}&body=${body}`
}

export function Messages() {
  const { items, loading, error, refetch } = useRefetchableList<ContactMessage>(() =>
    fetchAll("contact_submissions", "created_at", { ascending: false })
  )
  const [tab, setTab] = useState<FilterTab>("unread")

  const filtered = useMemo(() => {
    if (tab === "archived") return items.filter((m) => m.archived)
    if (tab === "unread") return items.filter((m) => !m.read && !m.archived)
    return items.filter((m) => !m.archived)
  }, [items, tab])

  const unreadCount = items.filter((m) => !m.read && !m.archived).length

  async function toggleRead(m: ContactMessage) {
    try {
      await updateRow("contact_submissions", m.id, { read: !m.read })
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  async function toggleArchived(m: ContactMessage) {
    try {
      await updateRow("contact_submissions", m.id, { archived: !m.archived })
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message? This can't be undone.")) return
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
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Messages</h2>
        <div className="inline-flex gap-1 rounded-lg border border-border bg-muted/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                tab === t.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {t.value === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-gray-900">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <PageEmpty
          message={
            tab === "unread"
              ? "No unread messages."
              : tab === "archived"
                ? "No archived messages."
                : "No messages yet."
          }
        />
      )}

      {filtered.map((m) => (
        <Card
          key={m.id}
          className={cn("flex items-start justify-between gap-4 p-4", !m.read && "border-gold/50")}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />}
              <p className="font-medium">
                {m.name} <span className="font-normal text-muted-foreground">· {m.email}</span>
              </p>
            </div>
            {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
            <p className="mt-2 text-sm">{m.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(m.created_at).toLocaleString("en-GB")}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" asChild aria-label="Reply by email">
              <a href={replyHref(m)}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleRead(m)}
              aria-label={m.read ? "Mark unread" : "Mark read"}
            >
              {m.read ? <Circle className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleArchived(m)}
              aria-label={m.archived ? "Unarchive" : "Archive"}
            >
              {m.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
