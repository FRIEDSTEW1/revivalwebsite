import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Baby,
  Calendar,
  CalendarCheck,
  ExternalLink,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { PageError, PageLoading } from "@/components/PageState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Reveal } from "@/components/motion/Reveal"
import { useAsync } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import {
  classesForPerson,
  fmtDateNice,
  fmtTime12,
  getClassAgeRules,
  getGymdeskSchedule,
  gymdeskBookingLink,
  nextOccurrenceISO,
} from "@/lib/gymdesk"
import type { GymdeskClass } from "@/lib/types"

type Audience = "child" | "adult"
type Step = "person" | "classes" | "review"

interface Selection {
  id: string
  personLabel: string
  className: string
  time: string
  dateIso: string
  link: string
}

async function loadBookingData() {
  const [schedule, rules] = await Promise.all([getGymdeskSchedule(), getClassAgeRules()])
  return { classes: schedule.data, scheduleError: schedule.error, rules }
}

export function Book() {
  const { data, loading, error } = useAsync(loadBookingData)

  const [step, setStep] = useState<Step>("person")
  const [audience, setAudience] = useState<Audience>("adult")
  const [childAge, setChildAge] = useState("")
  const [selections, setSelections] = useState<Selection[]>([])

  const personLabel = audience === "adult" ? "Adult (16+)" : `Child (age ${childAge})`
  const age = audience === "child" ? Number(childAge) : undefined

  const matchedClasses: GymdeskClass[] = useMemo(() => {
    if (!data) return []
    return classesForPerson(data.classes, data.rules, audience, age)
  }, [data, audience, age])

  function startClassSearch() {
    setStep("classes")
  }

  function addSelection(cls: GymdeskClass, slotIso: string, time: string, slotEventId: number) {
    setSelections((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        personLabel,
        className: cls.name,
        time,
        dateIso: slotIso,
        link: gymdeskBookingLink(slotEventId, slotIso),
      },
    ])
    setStep("review")
  }

  function removeSelection(id: string) {
    setSelections((s) => s.filter((sel) => sel.id !== id))
  }

  function addAnotherPerson() {
    setAudience("adult")
    setChildAge("")
    setStep("person")
  }

  if (loading) {
    return (
      <>
        <SEO title="Book a Class" description="Find and book your next class at Revival MMA." />
        <PageHeader eyebrow="Book Online" title="Book a Class" />
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          <PageLoading />
        </div>
      </>
    )
  }

  if (error || data?.scheduleError) {
    return (
      <>
        <SEO title="Book a Class" description="Find and book your next class at Revival MMA." />
        <PageHeader eyebrow="Book Online" title="Book a Class" />
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          <PageError message={error ?? data?.scheduleError ?? "Something went wrong."} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            You can still book by calling us on{" "}
            <a href="tel:+447540467320" className="font-medium text-gold-dark hover:underline dark:text-gold">
              +44 7540 467 320
            </a>{" "}
            or through the{" "}
            <Link to="/contact" className="font-medium text-gold-dark hover:underline dark:text-gold">
              contact form
            </Link>
            .
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Book a Class" description="Find and book your next class at Revival MMA." />
      <PageHeader
        eyebrow="Book Online"
        title="Book a Class"
        subtitle="Tell us who's training and we'll show you the classes that fit — booking a spot only takes a minute."
      />

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        {selections.length > 0 && step !== "review" && (
          <button
            type="button"
            onClick={() => setStep("review")}
            className="mb-8 flex w-full items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-gold/15 dark:text-gold"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              {selections.length} {selections.length === 1 ? "booking" : "bookings"} ready to
              complete
            </span>
            <span>Review →</span>
          </button>
        )}

        {step === "person" && (
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold">Who's this booking for?</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAudience("adult")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-5 transition-colors",
                    audience === "adult"
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/50"
                  )}
                >
                  <User className="h-6 w-6 text-gold-dark dark:text-gold" strokeWidth={1.75} />
                  <span className="font-semibold">Adult</span>
                  <span className="text-xs text-muted-foreground">16 and over</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("child")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-5 transition-colors",
                    audience === "child"
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/50"
                  )}
                >
                  <Baby className="h-6 w-6 text-gold-dark dark:text-gold" strokeWidth={1.75} />
                  <span className="font-semibold">Child</span>
                  <span className="text-xs text-muted-foreground">Under 16</span>
                </button>
              </div>

              {audience === "child" && (
                <div className="mt-5 flex flex-col gap-2">
                  <Label htmlFor="child-age">How old is your child?</Label>
                  <Input
                    id="child-age"
                    type="number"
                    min={1}
                    max={15}
                    inputMode="numeric"
                    placeholder="e.g. 7"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="max-w-32"
                  />
                </div>
              )}

              <Button
                size="lg"
                className="mt-7 w-full"
                disabled={audience === "child" && (!childAge || Number(childAge) < 1 || Number(childAge) > 15)}
                onClick={startClassSearch}
              >
                Find Classes
              </Button>
            </div>
          </Reveal>
        )}

        {step === "classes" && (
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setStep("person")}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div>
              <h2 className="font-serif text-xl font-bold">Classes for {personLabel}</h2>
              <p className="text-sm text-muted-foreground">
                Pick a time to book — this opens Revival's booking page to finish.
              </p>
            </div>

            {matchedClasses.length === 0 && (
              <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
                <p className="font-medium">No classes currently match this age.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get in touch and we'll help you find the right fit.
                </p>
                <Button asChild variant="outline" className="mt-5">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            )}

            {matchedClasses.map((cls, i) => {
              const upcoming = cls.slots
                .map((slot) => ({ slot, iso: nextOccurrenceISO(slot) }))
                .filter((x): x is { slot: (typeof cls.slots)[number]; iso: string } => x.iso !== null)
                .sort((a, b) => a.iso.localeCompare(b.iso))

              if (upcoming.length === 0) return null

              return (
                <Reveal key={cls.name} index={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold">{cls.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {upcoming.map(({ slot, iso }) => (
                      <button
                        key={slot.s}
                        type="button"
                        onClick={() => addSelection(cls, iso, slot.time, slot.s)}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:border-gold hover:bg-gold/10"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gold-dark dark:text-gold" />
                        {fmtDateNice(iso)} · {fmtTime12(slot.time)}
                      </button>
                    ))}
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}

        {step === "review" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-xl font-bold">Your Bookings</h2>
              <p className="text-sm text-muted-foreground">
                Each booking finishes on Revival's booking page, where you'll confirm and pay.
              </p>
            </div>

            {selections.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                No bookings added yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {selections.map((sel) => (
                  <li
                    key={sel.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gold-dark dark:text-gold">
                        {sel.personLabel}
                      </p>
                      <p className="font-serif text-lg font-bold">{sel.className}</p>
                      <p className="text-sm text-muted-foreground">
                        {fmtDateNice(sel.dateIso)} · {fmtTime12(sel.time)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm">
                        <a href={sel.link} target="_blank" rel="noreferrer">
                          Complete on Gymdesk
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSelection(sel.id)}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Button variant="outline" size="lg" onClick={addAnotherPerson} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Another Person
            </Button>

            {selections.length > 1 && (
              <p className="flex items-start gap-2 rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                <Users className="mt-0.5 h-4 w-4 shrink-0" />
                Booking for more than one person? Each booking is completed separately on
                Revival's page — if this is your first booking, it may ask you to add each child
                to your account there first.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
