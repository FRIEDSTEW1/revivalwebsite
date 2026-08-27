import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
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
  const reduce = useReducedMotion()

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
        <div className="mb-12 flex justify-center">
          <div
            role="group"
            aria-label="Filter classes by age group"
            className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-border bg-muted/60 p-1.5"
          >
            {FILTERS.map((f) => {
              const active = filter === f.value
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active ? "text-gray-900" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="classes-filter-pill"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-lg bg-gold-gradient shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {classes && filtered.length === 0 && (
          <PageEmpty message="No classes in this category yet." />
        )}
        {classes && filtered.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.38,
                    delay: reduce ? 0 : Math.min(i, 6) * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ClassCard gymClass={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  )
}
