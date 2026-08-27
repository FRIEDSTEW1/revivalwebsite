import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export type FieldType = "text" | "textarea" | "number" | "select" | "list"

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  options?: string[]
}

interface ResourceManagerProps<T extends { id: string }> {
  title: string
  items: T[]
  fields: FieldConfig[]
  renderRow: (item: T) => React.ReactNode
  onCreate: (values: Record<string, string>) => Promise<void>
  onUpdate: (id: string, values: Record<string, string>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  toFormValues: (item: T) => Record<string, string>
}

export function ResourceManager<T extends { id: string }>({
  title,
  items,
  fields,
  renderRow,
  onCreate,
  onUpdate,
  onDelete,
  toFormValues,
}: ResourceManagerProps<T>) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setValues(Object.fromEntries(fields.map((f) => [f.key, ""])))
    setOpen(true)
  }

  function openEdit(item: T) {
    setEditing(item)
    setValues(toFormValues(item))
    setOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await onUpdate(editing.id, values)
        toast.success(`${title.slice(0, -1)} updated`)
      } else {
        await onCreate(values)
        toast.success(`${title.slice(0, -1)} created`)
      }
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return
    try {
      await onDelete(id)
      toast.success(`${title.slice(0, -1)} deleted`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" onClick={openCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetTitle>{editing ? "Edit" : "Add"} {title.slice(0, -1)}</SheetTitle>
            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.key}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                  {field.type === "select" && (
                    <Select
                      value={values[field.key] ?? ""}
                      onValueChange={(val) => setValues((v) => ({ ...v, [field.key]: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {(field.type === "text" || field.type === "number" || field.type === "list") && (
                    <Input
                      id={field.key}
                      type={field.type === "number" ? "number" : "text"}
                      value={values[field.key] ?? ""}
                      placeholder={field.type === "list" ? "Comma-separated" : undefined}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <Button onClick={handleSave} disabled={saving} className="mt-2">
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No items yet — add the first one.</p>
        )}
        {items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">{renderRow(item)}</div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
