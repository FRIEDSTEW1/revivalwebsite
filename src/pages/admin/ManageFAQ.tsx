import { ResourceManager, type FieldConfig } from "@/components/admin/ResourceManager"
import { PageError, PageLoading } from "@/components/PageState"
import { useRefetchableList } from "@/lib/hooks"
import { fetchAll, createRow, updateRow, deleteRow, persistOrder } from "@/lib/adminApi"
import type { FAQItem } from "@/lib/types"

const fields: FieldConfig[] = [
  { key: "question", label: "Question", type: "text" },
  { key: "answer", label: "Answer", type: "textarea" },
  { key: "category", label: "Category", type: "text" },
]

function toRow(values: Record<string, string>) {
  return {
    question: values.question,
    answer: values.answer,
    category: values.category,
  }
}

export function ManageFAQ() {
  const { items, loading, error, refetch } = useRefetchableList<FAQItem>(() =>
    fetchAll("faq_items", "order")
  )

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <ResourceManager<FAQItem>
      title="FAQ Items"
      items={items}
      fields={fields}
      orderable
      onReorder={async (ids) => {
        await persistOrder("faq_items", ids)
        await refetch()
      }}
      renderRow={(f) => (
        <div>
          <p className="font-medium">{f.question}</p>
          <p className="text-xs text-muted-foreground">{f.category}</p>
        </div>
      )}
      toFormValues={(f) => ({
        question: f.question,
        answer: f.answer,
        category: f.category,
      })}
      onCreate={async (values) => {
        await createRow("faq_items", { ...toRow(values), order: items.length })
        await refetch()
      }}
      onUpdate={async (id, values) => {
        await updateRow("faq_items", id, toRow(values))
        await refetch()
      }}
      onDelete={async (id) => {
        await deleteRow("faq_items", id)
        await refetch()
      }}
    />
  )
}
