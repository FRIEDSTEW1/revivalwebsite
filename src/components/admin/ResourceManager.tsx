import { useEffect, useState, type ReactNode } from "react"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
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
import { ImageUploadField } from "@/components/admin/ImageUploadField"

export type FieldType = "text" | "textarea" | "number" | "select" | "list" | "image"

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  options?: string[]
  /** Storage sub-folder for type: "image" fields. */
  folder?: string
}

interface ResourceManagerProps<T extends { id: string }> {
  title: string
  items: T[]
  fields: FieldConfig[]
  renderRow: (item: T) => ReactNode
  onCreate: (values: Record<string, string>) => Promise<void>
  onUpdate: (id: string, values: Record<string, string>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  toFormValues: (item: T) => Record<string, string>
  /** Enables drag handles; `items` must already be sorted the way `order` reflects. */
  orderable?: boolean
  onReorder?: (orderedIds: string[]) => Promise<void>
}

function SortableCard({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  return (
    // A plain div (not the Card component) because dnd-kit's setNodeRef needs
    // a direct ref to the DOM node, and Card doesn't forward refs.
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm",
        isDragging && "relative z-10 shadow-md"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  )
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
  orderable = false,
  onReorder,
}: ResourceManagerProps<T>) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<string[]>(() => items.map((i) => i.id))

  useEffect(() => {
    setOrder(items.map((i) => i.id))
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = order.indexOf(String(active.id))
    const newIndex = order.indexOf(String(over.id))
    const next = arrayMove(order, oldIndex, newIndex)
    setOrder(next)

    try {
      await onReorder?.(next)
    } catch (err) {
      setOrder(items.map((i) => i.id))
      toast.error(err instanceof Error ? err.message : "Couldn't save the new order.")
    }
  }

  const byId = new Map(items.map((item) => [item.id, item]))
  const orderedItems = orderable
    ? (order.map((id) => byId.get(id)).filter(Boolean) as T[])
    : items

  function renderCardBody(item: T) {
    return (
      <>
        <div className="min-w-0 flex-1">{renderRow(item)}</div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          {orderable && items.length > 1 && (
            <p className="text-xs text-muted-foreground">Drag to reorder — changes save immediately.</p>
          )}
        </div>
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
                  {field.type === "image" && (
                    <ImageUploadField
                      value={values[field.key] ?? ""}
                      onChange={(url) => setValues((v) => ({ ...v, [field.key]: url }))}
                      folder={field.folder ?? "misc"}
                    />
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

        {orderable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              {orderedItems.map((item) => (
                <SortableCard key={item.id} id={item.id}>
                  {renderCardBody(item)}
                </SortableCard>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between gap-4 p-4">
              {renderCardBody(item)}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
