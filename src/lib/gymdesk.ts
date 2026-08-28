import { supabase } from "./supabase"
import type { BookingAudience, ClassAgeRule, GymdeskClass, GymdeskSlot, MatchedClass } from "./types"

// Revival MMA's real Gymdesk constants (from the public /book page's own
// booking links). Not secret — they're visible in any booking URL on the
// site — but if the gym ever changes booking software or Gymdesk accounts,
// update both this and GYMDESK_SUBDOMAIN in
// supabase/functions/gymdesk-schedule/index.ts (set via `supabase secrets set`).
export const GYMDESK_SUBDOMAIN = "revival-mma"
export const GYMDESK_SCHEDULE_ID = "28679"

const SCAN_HORIZON_DAYS = 60

function isoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/** Gymdesk uses Mon=1..Sun=7; JS Date#getDay() uses Sun=0..Sat=6. */
function gymdeskDayToJs(day: number): number {
  return day === 7 ? 0 : day
}

/**
 * The soonest upcoming date (today included) this slot actually runs,
 * respecting one-off `scheduled` dates, `startDate`, and `cancelDate`.
 * Returns null if nothing falls within the scan horizon.
 */
export function nextOccurrenceISO(
  slot: GymdeskSlot,
  from: Date = new Date(),
  horizonDays = SCAN_HORIZON_DAYS
): string | null {
  if (slot.scheduled) {
    return slot.scheduled >= isoDate(from) ? slot.scheduled : null
  }
  if (slot.day == null) return null

  const targetJsDay = gymdeskDayToJs(slot.day)
  for (let i = 0; i < horizonDays; i++) {
    const candidate = new Date(from)
    candidate.setDate(from.getDate() + i)
    if (candidate.getDay() !== targetJsDay) continue

    const iso = isoDate(candidate)
    if (slot.startDate && iso < slot.startDate) continue
    if (slot.cancelDate && slot.cancelDate === iso) continue
    return iso
  }
  return null
}

/** Does this slot actually run on this specific calendar date? */
export function occursOnDate(slot: GymdeskSlot, iso: string): boolean {
  if (slot.scheduled) return slot.scheduled === iso
  if (slot.day == null) return false

  const targetJsDay = gymdeskDayToJs(slot.day)
  if (new Date(`${iso}T12:00:00`).getDay() !== targetJsDay) return false
  if (slot.startDate && iso < slot.startDate) return false
  if (slot.cancelDate === iso) return false
  return true
}

export interface DateOption {
  iso: string
  label: string
  sub: string
}

/** A quick-pick strip of the next `days` calendar dates, for a date picker. */
export function upcomingDateOptions(days = 14, from: Date = new Date()): DateOption[] {
  const out: DateOption[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(from)
    d.setDate(from.getDate() + i)
    out.push({
      iso: isoDate(d),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GB", { weekday: "short" }),
      sub: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    })
  }
  return out
}

/** "20:00:00" -> "8pm", "16:30:00" -> "4:30pm" */
export function fmtTime12(time: string): string {
  const [hStr, mStr] = (time || "").split(":")
  let h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10) || 0
  if (Number.isNaN(h)) return time
  const ap = h >= 12 ? "pm" : "am"
  h = h % 12 || 12
  return m ? `${h}:${String(m).padStart(2, "0")}${ap}` : `${h}${ap}`
}

/** "2026-09-01" -> "Tue, 1 Sep" */
export function fmtDateNice(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export function gymdeskBookingLink(slotEventId: number, dateIso: string): string {
  return `https://${GYMDESK_SUBDOMAIN}.gymdesk.com/book?date=${dateIso}&s=${slotEventId}&schedule=${GYMDESK_SCHEDULE_ID}`
}

/**
 * Adults aren't asked a specific age (just "16+"), so an adult person only
 * needs to match on audience; a child's exact age is checked against the
 * rule's min/max.
 */
export function ruleMatchesPerson(rule: ClassAgeRule, audience: BookingAudience, age?: number): boolean {
  if (rule.audience !== "both" && rule.audience !== audience) return false
  if (audience === "adult") return true
  if (age == null) return false
  if (rule.min_age != null && age < rule.min_age) return false
  if (rule.max_age != null && age > rule.max_age) return false
  return true
}

/**
 * Classes shown to a visitor are only ever ones an admin has explicitly
 * tagged with an age range in class_age_rules — an untagged Gymdesk class
 * (e.g. one just added, or renamed) is hidden rather than guessed at, so we
 * never show an adult-only class to a 5-year-old's parent by accident.
 */
export function classesForPerson(
  schedule: GymdeskClass[],
  rules: ClassAgeRule[],
  audience: "child" | "adult",
  age?: number
): MatchedClass[] {
  const ruleByName = new Map(rules.map((r) => [r.gymdesk_name, r]))
  const out: MatchedClass[] = []
  for (const c of schedule) {
    const rule = ruleByName.get(c.name)
    if (rule && ruleMatchesPerson(rule, audience, age)) {
      out.push({ ...c, discipline: rule.discipline })
    }
  }
  return out
}

interface GymdeskFetchResult {
  data: GymdeskClass[]
  error: string | null
}

/** Calls the gymdesk-schedule edge function (see supabase/functions/). */
export async function getGymdeskSchedule(): Promise<GymdeskFetchResult> {
  if (!supabase) {
    return {
      data: [],
      error: "Booking isn't connected yet — see supabase/README.md.",
    }
  }
  try {
    const { data, error } = await supabase.functions.invoke<GymdeskClass[]>("gymdesk-schedule")
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    return {
      data: [],
      error:
        err instanceof Error
          ? err.message
          : "Couldn't load the live class schedule. Please try again shortly.",
    }
  }
}

export async function getClassAgeRules(): Promise<ClassAgeRule[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("class_age_rules").select("*")
  if (error) return []
  return data as ClassAgeRule[]
}
