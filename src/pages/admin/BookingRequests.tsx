import { useMemo, useState } from "react"
import { CheckCircle2, Download, ExternalLink, RotateCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, deleteRow, updateRow } from "@/lib/adminApi"
import { fmtTime12 } from "@/lib/gymdesk"
import { cn } from "@/lib/utils"
import type { BookingRequest } from "@/lib/types"

type FilterTab = "pending" | "paid" | "all"

const TABS: { value: FilterTab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "all", label: "All" },
]

interface Session {
  sessionId: string
  rows: BookingRequest[]
}

function groupBySession(rows: BookingRequest[]): Session[] {
  const map = new Map<string, BookingRequest[]>()
  rows.forEach((r) => {
    const list = map.get(r.session_id) ?? []
    list.push(r)
    map.set(r.session_id, list)
  })
  return Array.from(map.values())
    .map((rows) => ({ sessionId: rows[0].session_id, rows }))
    .sort((a, b) => (a.rows[0].created_at < b.rows[0].created_at ? 1 : -1))
}

function downloadCsv(items: BookingRequest[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const header =
    "created_at,session_id,contact_name,contact_email,contact_phone,person_label,class_name,discipline,date_iso,time,people_count,payment_status,gymdesk_link"
  const rows = [
    header,
    ...items.map((i) =>
      [
        i.created_at,
        i.session_id,
        i.contact_name,
        i.contact_email,
        i.contact_phone ?? "",
        i.person_label,
        i.class_name,
        i.discipline ?? "",
        i.date_iso,
        i.time,
        String(i.people_count),
        i.payment_status,
        i.gymdesk_link,
      ]
        .map(escape)
        .join(",")
    ),
  ]
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `booking-requests-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function BookingRequests() {
  const { items, loading, error, refetch } = useRefetchableList<BookingRequest>(() =>
    fetchAll("booking_requests", "created_at", { ascending: false })
  )
  const [tab, setTab] = useState<FilterTab>("pending")
  const [busySession, setBusySession] = useState<string | null>(null)

  const sessions = useMemo(() => groupBySession(items), [items])
  const pendingCount = sessions.filter((s) => s.rows[0].payment_status === "pending").length

  const filtered = useMemo(() => {
    if (tab === "all") return sessions
    return sessions.filter((s) => s.rows[0].payment_status === tab)
  }, [sessions, tab])

  async function setSessionStatus(session: Session, status: "pending" | "paid") {
    setBusySession(session.sessionId)
    try {
      await Promise.all(
        session.rows.map((r) => updateRow("booking_requests", r.id, { payment_status: status }))
      )
      await refetch()
      toast.success(status === "paid" ? "Marked as paid" : "Marked back as pending")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setBusySession(null)
    }
  }

  async function handleDelete(session: Session) {
    if (!confirm("Delete this booking? This can't be undone.")) return
    setBusySession(session.sessionId)
    try {
      await Promise.all(session.rows.map((r) => deleteRow("booking_requests", r.id)))
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setBusySession(null)
    }
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold">Booking Requests</h2>
        <div className="flex items-center gap-2">
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
                {t.value === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-gray-900">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
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
      </div>

      <p className="rounded-lg bg-muted/60 px-4 py-2.5 text-xs text-muted-foreground">
        Each row here is a checkout attempt logged the moment someone clicked Pay — it does{" "}
        <strong>not</strong> mean they actually paid. Check the name/amount against your real SumUp
        transactions, then mark it Paid here.
      </p>

      {filtered.length === 0 && (
        <PageEmpty
          message={
            tab === "pending"
              ? "No pending bookings."
              : tab === "paid"
                ? "No paid bookings yet."
                : "No booking requests yet."
          }
        />
      )}

      {filtered.map((session) => {
        const first = session.rows[0]
        const isPaid = first.payment_status === "paid"
        const busy = busySession === session.sessionId
        return (
          <Card
            key={session.sessionId}
            className={cn("flex flex-col gap-3 p-4", !isPaid && "border-amber-300 dark:border-amber-500/40")}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {first.contact_name}{" "}
                  <span className="font-normal text-muted-foreground">· {first.contact_email}</span>
                </p>
                {first.contact_phone && (
                  <p className="text-xs text-muted-foreground">{first.contact_phone}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(first.created_at).toLocaleString("en-GB")} · {first.people_count}{" "}
                  {first.people_count === 1 ? "person" : "people"}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  isPaid
                    ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                )}
              >
                {isPaid ? "Paid" : "Pending"}
              </span>
            </div>

            <ul className="flex flex-col gap-1.5">
              {session.rows.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{r.person_label}</span> — {r.class_name}
                    {r.discipline && <span className="text-muted-foreground"> ({r.discipline})</span>}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {new Date(`${r.date_iso}T12:00:00`).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {fmtTime12(r.time)}
                    <a
                      href={r.gymdesk_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-gold-dark hover:underline dark:text-gold"
                    >
                      Gymdesk <ExternalLink className="h-3 w-3" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-end gap-2">
              {isPaid ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => setSessionStatus(session, "pending")}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Mark Pending
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => setSessionStatus(session, "paid")}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Paid
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                disabled={busy}
                onClick={() => handleDelete(session)}
                aria-label="Delete booking"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
