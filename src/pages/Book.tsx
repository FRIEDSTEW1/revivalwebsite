import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Baby,
  Banknote,
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
  fmtTime12,
  getClassAgeRules,
  getGymdeskSchedule,
  gymdeskBookingLink,
  occursOnDate,
  upcomingDateOptions,
} from "@/lib/gymdesk"
import { getSumupLink, MAX_BOOKING_PEOPLE } from "@/lib/payment"
import type { Booking, BookingPerson, GymdeskSlot, MatchedClass } from "@/lib/types"

type Step = "person" | "classes" | "review"

async function loadBookingData() {
  const [schedule, rules] = await Promise.all([getGymdeskSchedule(), getClassAgeRules()])
  return { classes: schedule.data, scheduleError: schedule.error, rules }
}

export function Book() {
  const { data, loading, error } = useAsync(loadBookingData)

  const [people, setPeople] = useState<BookingPerson[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [step, setStep] = useState<Step>("person")
  const [activePersonId, setActivePersonId] = useState<string | null>(null)

  const [draftAudience, setDraftAudience] = useState<"adult" | "child">("adult")
  const [draftAge, setDraftAge] = useState("")

  const [discipline, setDiscipline] = useState<string>("all")
  const dateOptions = useMemo(() => upcomingDateOptions(14), [])
  const [dateIso, setDateIso] = useState(dateOptions[0].iso)

  const activePerson = people.find((p) => p.id === activePersonId) ?? null

  const matchedClasses: MatchedClass[] = useMemo(() => {
    if (!data || !activePerson) return []
    return classesForPerson(data.classes, data.rules, activePerson.audience, activePerson.age)
  }, [data, activePerson])

  const disciplines = useMemo(() => {
    const set = new Set<string>()
    matchedClasses.forEach((c) => c.discipline && set.add(c.discipline))
    return Array.from(set).sort()
  }, [matchedClasses])

  const dayMatches = useMemo(() => {
    const rows: { cls: MatchedClass; slot: GymdeskSlot }[] = []
    matchedClasses
      .filter((c) => discipline === "all" || c.discipline === discipline)
      .forEach((cls) => {
        cls.slots.forEach((slot) => {
          if (occursOnDate(slot, dateIso)) rows.push({ cls, slot })
        })
      })
    return rows.sort((a, b) => a.slot.time.localeCompare(b.slot.time))
  }, [matchedClasses, discipline, dateIso])

  function startPersonSearch() {
    const person: BookingPerson = {
      id: crypto.randomUUID(),
      audience: draftAudience,
      age: draftAudience === "child" ? Number(draftAge) : undefined,
      label: draftAudience === "adult" ? "Adult (16+)" : `Child (age ${draftAge})`,
    }
    setPeople((p) => [...p, person])
    setActivePersonId(person.id)
    setDiscipline("all")
    setDateIso(dateOptions[0].iso)
    setStep("classes")
  }

  function addBooking(cls: MatchedClass, slot: GymdeskSlot) {
    if (!activePerson) return
    setBookings((b) => [
      ...b,
      {
        id: crypto.randomUUID(),
        personId: activePerson.id,
        personLabel: activePerson.label,
        className: cls.name,
        discipline: cls.discipline,
        dateIso,
        time: slot.time,
        link: gymdeskBookingLink(slot.s, dateIso),
      },
    ])
    setStep("review")
  }

  function removeBooking(id: string) {
    setBookings((b) => b.filter((x) => x.id !== id))
  }

  function removePerson(personId: string) {
    setPeople((p) => p.filter((x) => x.id !== personId))
    setBookings((b) => b.filter((x) => x.personId !== personId))
  }

  function goBackFromClasses() {
    const stillHasBookings = bookings.some((b) => b.personId === activePersonId)
    const remaining = people.filter((p) => p.id !== activePersonId)
    if (!stillHasBookings) {
      setPeople(remaining)
    }
    setActivePersonId(null)
    setStep(stillHasBookings || remaining.length > 0 ? "review" : "person")
  }

  function addAnotherClassFor(personId: string) {
    setActivePersonId(personId)
    setDiscipline("all")
    setDateIso(dateOptions[0].iso)
    setStep("classes")
  }

  function startAddPerson() {
    setDraftAudience("adult")
    setDraftAge("")
    setStep("person")
  }

  const canAddPerson = people.length < MAX_BOOKING_PEOPLE
  const sumupLink = getSumupLink(people.length)
  const peopleWithoutBookings = people.filter((p) => !bookings.some((b) => b.personId === p.id))

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
        subtitle="Tell us who's training, pick a date, and book straight through to Revival's booking page."
      />

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        {bookings.length > 0 && step !== "review" && (
          <button
            type="button"
            onClick={() => setStep("review")}
            className="mb-8 flex w-full items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-gold/15 dark:text-gold"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} for{" "}
              {people.length} {people.length === 1 ? "person" : "people"}
            </span>
            <span>Review →</span>
          </button>
        )}

        {step === "person" && (
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              {people.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to your bookings
                </button>
              )}

              <h2 className="font-serif text-xl font-bold">Who's this booking for?</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDraftAudience("adult")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-5 transition-colors",
                    draftAudience === "adult"
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
                  onClick={() => setDraftAudience("child")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-5 transition-colors",
                    draftAudience === "child"
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/50"
                  )}
                >
                  <Baby className="h-6 w-6 text-gold-dark dark:text-gold" strokeWidth={1.75} />
                  <span className="font-semibold">Child</span>
                  <span className="text-xs text-muted-foreground">Under 16</span>
                </button>
              </div>

              {draftAudience === "child" && (
                <div className="mt-5 flex flex-col gap-2">
                  <Label htmlFor="child-age">How old is your child?</Label>
                  <Input
                    id="child-age"
                    type="number"
                    min={1}
                    max={15}
                    inputMode="numeric"
                    placeholder="e.g. 7"
                    value={draftAge}
                    onChange={(e) => setDraftAge(e.target.value)}
                    className="max-w-32"
                  />
                </div>
              )}

              <Button
                size="lg"
                className="mt-7 w-full"
                disabled={
                  draftAudience === "child" &&
                  (!draftAge || Number(draftAge) < 1 || Number(draftAge) > 15)
                }
                onClick={startPersonSearch}
              >
                Find Classes
              </Button>
            </div>
          </Reveal>
        )}

        {step === "classes" && activePerson && (
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={goBackFromClasses}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div>
              <h2 className="font-serif text-xl font-bold">Classes for {activePerson.label}</h2>
              <p className="text-sm text-muted-foreground">Pick a date to see what's on.</p>
            </div>

            {disciplines.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {["all", ...disciplines].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscipline(d)}
                    aria-pressed={discipline === d}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      discipline === d
                        ? "border-transparent bg-gold-gradient text-gray-900"
                        : "border-border text-muted-foreground hover:border-gold/60 hover:text-foreground"
                    )}
                  >
                    {d === "all" ? "All Classes" : d}
                  </button>
                ))}
              </div>
            )}

            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
              {dateOptions.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setDateIso(d.iso)}
                  aria-pressed={dateIso === d.iso}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-lg border px-4 py-2.5 transition-colors",
                    dateIso === d.iso
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/50"
                  )}
                >
                  <span className="text-sm font-semibold">{d.label}</span>
                  <span className="text-xs text-muted-foreground">{d.sub}</span>
                </button>
              ))}
            </div>

            {matchedClasses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
                <p className="font-medium">No classes currently match this age.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get in touch and we'll help you find the right fit.
                </p>
                <Button asChild variant="outline" className="mt-5">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            ) : dayMatches.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                Nothing on this day — try another date above.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {dayMatches.map(({ cls, slot }, i) => (
                  <Reveal key={slot.s} as="li" index={Math.min(i, 6)}>
                    <button
                      type="button"
                      onClick={() => addBooking(cls, slot)}
                      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 text-left shadow-sm transition-colors hover:border-gold hover:bg-gold/5"
                    >
                      <span>
                        <span className="block font-serif text-base font-bold">{cls.name}</span>
                        <span className="text-sm text-muted-foreground">{fmtTime12(slot.time)}</span>
                      </span>
                      <span className="shrink-0 rounded-lg bg-gold-gradient px-3 py-1.5 text-sm font-semibold text-gray-900">
                        Book
                      </span>
                    </button>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === "review" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-xl font-bold">Your Bookings</h2>
              <p className="text-sm text-muted-foreground">
                Reserve each class time on Gymdesk, then complete payment below.
              </p>
            </div>

            {people.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                No one added yet.
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {people.map((person) => {
                  const personBookings = bookings.filter((b) => b.personId === person.id)
                  return (
                    <div key={person.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-serif text-lg font-bold">{person.label}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePerson(person.id)}
                          aria-label={`Remove ${person.label}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {personBookings.length === 0 ? (
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-400">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          No class picked yet.
                        </p>
                      ) : (
                        <ul className="mt-3 flex flex-col gap-2">
                          {personBookings.map((b) => (
                            <li
                              key={b.id}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 px-4 py-3"
                            >
                              <span>
                                <span className="block text-sm font-semibold">{b.className}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(`${b.dateIso}T12:00:00`).toLocaleDateString("en-GB", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}{" "}
                                  · {fmtTime12(b.time)}
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Button asChild size="sm">
                                  <a href={b.link} target="_blank" rel="noreferrer">
                                    Reserve on Gymdesk
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeBooking(b.id)}
                                  aria-label="Remove booking"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAnotherClassFor(person.id)}
                        className="mt-3 gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Another Class
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            {canAddPerson ? (
              <Button variant="outline" size="lg" onClick={startAddPerson} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Another Person
              </Button>
            ) : (
              <p className="flex items-start gap-2 rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                <Users className="mt-0.5 h-4 w-4 shrink-0" />
                Booking for more than {MAX_BOOKING_PEOPLE} people? Please{" "}
                <Link to="/contact" className="font-medium text-gold-dark hover:underline dark:text-gold">
                  contact us directly
                </Link>{" "}
                to arrange a larger group.
              </p>
            )}

            {people.length > 0 && (
              <div className="rounded-xl border border-gold/40 bg-gold/5 p-6">
                <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
                  <Banknote className="h-5 w-5 text-gold-dark dark:text-gold" />
                  Complete Payment
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Payment covers {people.length} {people.length === 1 ? "person" : "people"}.
                </p>
                {peopleWithoutBookings.length > 0 && (
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-amber-700 dark:text-amber-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {peopleWithoutBookings.map((p) => p.label).join(", ")} still{" "}
                    {peopleWithoutBookings.length === 1 ? "needs" : "need"} a class picked above.
                  </p>
                )}
                {sumupLink && (
                  <Button asChild size="lg" className="mt-5 w-full">
                    <a href={sumupLink} target="_blank" rel="noreferrer">
                      Pay for {people.length} {people.length === 1 ? "Person" : "People"}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
