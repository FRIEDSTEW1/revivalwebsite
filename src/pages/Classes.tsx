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

        {/*
          One crossfade for the whole result set on filter change, rather
          than each card animating its own position/opacity independently —
          per-card `layout` reflow plus staggered delays restarting on every
          click was the source of the timetable's filter-switch glitchiness,
          so the same simpler pattern is used here.
        */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
