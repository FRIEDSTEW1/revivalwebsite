import { useMemo, useState } from "react"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { ClassCard } from "@/components/ClassCard"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getClasses } from "@/lib/data"
import type { ClassCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const FILTERS: { value: ClassCategory | "all"; label: string }[] = [
  { value: "all", label: "All Ages" },
  { value: "kids", label: "Kids" },
  { value: "teens", label: "Teens" },
  { value: "adults", label: "Adults" },
]

export function Classes() {
  const { data: classes, loading, error } = useAsync(getClasses)
  const [filter, setFilter] = useState<ClassCategory | "all">("all")

  const filtered = useMemo(() => {
    if (!classes) return []
    return filter === "all" ? classes : classes.filter((c) => c.category === filter)
  }, [classes, filter])

  return (
    <>
      <SEO
        title="Classes"
        description="Choose from our diverse range of training programs: Boxing, Kickboxing, BJJ, MMA and Personal Training. From toddlers to adults, beginners to advanced athletes."
      />
      <PageHeader
        eyebrow="Training Programs"
        title="Our Classes"
        subtitle="Find the perfect class for your goals and experience level."
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                filter === f.value
                  ? "border-transparent bg-gold-gradient text-gray-900 shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {classes && filtered.length === 0 && (
          <PageEmpty message="No classes in this category yet." />
        )}
        {classes && filtered.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <ClassCard key={c.id} gymClass={c} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
