import { useMemo, useState } from "react"
import { SEO } from "@/components/SEO"
import { ClassCard } from "@/components/ClassCard"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { Button } from "@/components/ui/button"
import { useAsync } from "@/lib/hooks"
import { getClasses } from "@/lib/data"
import type { ClassCategory } from "@/lib/types"

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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SEO
        title="Classes"
        description="Choose from our diverse range of training programs: Boxing, Kickboxing, BJJ, MMA and Personal Training. From toddlers to adults, beginners to advanced athletes."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Our Classes</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Find the perfect class for your goals and experience level.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {classes && filtered.length === 0 && <PageEmpty message="No classes in this category yet." />}
      {classes && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ClassCard key={c.id} gymClass={c} />
          ))}
        </div>
      )}
    </div>
  )
}
