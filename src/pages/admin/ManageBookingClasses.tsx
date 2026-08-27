import { useEffect, useState } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageError, PageLoading } from "@/components/PageState"
import { getGymdeskSchedule, getClassAgeRules } from "@/lib/gymdesk"
import { createRow, updateRow } from "@/lib/adminApi"
import type { BookingAudience, ClassAgeRule } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RowState {
  gymdeskName: string
  rule: ClassAgeRule | null
  audience: BookingAudience
  minAge: string
  maxAge: string
  saving: boolean
}

export function ManageBookingClasses() {
  const [rows, setRows] = useState<RowState[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [{ data: schedule, error: scheduleError }, rules] = await Promise.all([
        getGymdeskSchedule(),
        getClassAgeRules(),
      ])
      if (scheduleError) throw new Error(scheduleError)

      const ruleByName = new Map(rules.map((r) => [r.gymdesk_name, r]))
      const names = [...new Set(schedule.map((c) => c.name))].sort()

      setRows(
        names.map((name) => {
          const rule = ruleByName.get(name) ?? null
          return {
            gymdeskName: name,
            rule,
            audience: rule?.audience ?? "child",
            minAge: rule?.min_age != null ? String(rule.min_age) : "",
            maxAge: rule?.max_age != null ? String(rule.max_age) : "",
            saving: false,
          }
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function patchRow(name: string, patch: Partial<RowState>) {
    setRows((rs) => rs.map((r) => (r.gymdeskName === name ? { ...r, ...patch } : r)))
  }

  async function handleSave(row: RowState) {
    patchRow(row.gymdeskName, { saving: true })
    const payload = {
      gymdesk_name: row.gymdeskName,
      audience: row.audience,
      min_age: row.minAge.trim() === "" ? null : Number(row.minAge),
      max_age: row.maxAge.trim() === "" ? null : Number(row.maxAge),
      updated_at: new Date().toISOString(),
    }
    try {
      if (row.rule) {
        await updateRow("class_age_rules", row.rule.id, payload)
      } else {
        await createRow("class_age_rules", payload)
      }
      toast.success(`Saved "${row.gymdeskName}"`)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.")
      patchRow(row.gymdeskName, { saving: false })
    }
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  const unclassifiedCount = rows.filter((r) => !r.rule).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">Booking Classes</h2>
          <p className="text-sm text-muted-foreground">
            Set who each Gymdesk class is for. The booking widget on{" "}
            <code className="text-xs">/book</code> only shows classes with an age range set here —
            new or renamed classes need to be classified before they'll appear to visitors.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="shrink-0 gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {unclassifiedCount > 0 && (
        <p className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {unclassifiedCount} {unclassifiedCount === 1 ? "class needs" : "classes need"} an age
          range before {unclassifiedCount === 1 ? "it shows" : "they show"} on the booking widget.
        </p>
      )}

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No classes found on the live Gymdesk schedule yet.
        </p>
      )}

      {rows.map((row) => (
        <Card
          key={row.gymdeskName}
          className={cn("flex flex-wrap items-end gap-4 p-4", !row.rule && "border-amber-300 dark:border-amber-500/40")}
        >
          <div className="min-w-40 flex-1">
            <p className="font-medium">{row.gymdeskName}</p>
            {!row.rule && <p className="text-xs text-amber-700 dark:text-amber-400">Needs setup</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Who's it for</Label>
            <Select
              value={row.audience}
              onValueChange={(v) => patchRow(row.gymdeskName, { audience: v as BookingAudience })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="child">Children</SelectItem>
                <SelectItem value="adult">Adults</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Min age</Label>
            <Input
              type="number"
              min={0}
              className="w-24"
              placeholder="None"
              value={row.minAge}
              onChange={(e) => patchRow(row.gymdeskName, { minAge: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Max age</Label>
            <Input
              type="number"
              min={0}
              className="w-24"
              placeholder="None"
              value={row.maxAge}
              onChange={(e) => patchRow(row.gymdeskName, { maxAge: e.target.value })}
            />
          </div>

          <Button onClick={() => handleSave(row)} disabled={row.saving} size="sm">
            {row.saving ? "Saving..." : "Save"}
          </Button>
        </Card>
      ))}
    </div>
  )
}
