import { supabase } from "./supabase"
import {
  classesSeed,
  teamSeed,
  testimonialsSeed,
  timetableSeed,
  faqSeed,
  pageContentSeed,
} from "./seedData"
import type {
  GymClass,
  TeamMember,
  Testimonial,
  TimetableEntry,
  FAQItem,
  ContactSubmission,
} from "./types"

// Reads always resolve to something renderable. Supabase is the source of
// truth once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set and the
// schema+seed have been run (see supabase/README.md). Until then — or if the
// network is down, the tables don't exist yet, or the request times out — we
// serve the content bundled in seedData.ts rather than showing a visitor a
// spinner or an error. A public gym site should never render empty.

const TIMEOUT_MS = 8000

async function readOrFallback<T>(
  fallback: T,
  query: () => PromiseLike<{ data: unknown; error: unknown }>
): Promise<T> {
  if (!supabase) return fallback

  try {
    const result = await Promise.race([
      Promise.resolve(query()),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase request timed out")), TIMEOUT_MS)
      ),
    ])

    if (result.error) throw result.error
    if (result.data == null || (Array.isArray(result.data) && result.data.length === 0)) {
      return fallback
    }
    return result.data as T
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[data] Supabase read failed, serving bundled content:", err)
    }
    return fallback
  }
}

export function getClasses(): Promise<GymClass[]> {
  return readOrFallback(classesSeed, () => supabase!.from("classes").select("*").order("name"))
}

export function getTeam(): Promise<TeamMember[]> {
  return readOrFallback(teamSeed, () =>
    supabase!.from("team_members").select("*").order("experience", { ascending: false })
  )
}

export function getTestimonials(): Promise<Testimonial[]> {
  return readOrFallback(testimonialsSeed, () => supabase!.from("testimonials").select("*"))
}

export function getTimetable(): Promise<TimetableEntry[]> {
  return readOrFallback(timetableSeed, () => supabase!.from("timetable_entries").select("*"))
}

export function getFAQs(): Promise<FAQItem[]> {
  const sortedSeed = [...faqSeed].sort((a, b) => a.order - b.order)
  return readOrFallback(sortedSeed, () => supabase!.from("faq_items").select("*").order("order"))
}

export async function getPageContent(page: string): Promise<string | null> {
  const seed = pageContentSeed.find((p) => p.page === page)?.content ?? null
  const row = await readOrFallback<{ content: string } | null>(null, () =>
    supabase!.from("page_content").select("content").eq("page", page).maybeSingle()
  )
  return row?.content ?? seed
}

export async function submitContact(submission: ContactSubmission): Promise<void> {
  if (!supabase) {
    throw new Error(
      "The contact form isn't connected to a backend yet. Set up Supabase (see supabase/README) to start receiving messages."
    )
  }
  const { error } = await supabase.from("contact_submissions").insert(submission)
  if (error) throw error
}

export async function subscribeNewsletter(email: string): Promise<void> {
  if (!supabase) {
    throw new Error(
      "The newsletter isn't connected to a backend yet. Set up Supabase (see supabase/README) to start collecting subscribers."
    )
  }
  const { error } = await supabase.from("newsletter_subscribers").insert({ email })
  if (error) {
    if (error.code === "23505") {
      throw new Error("That email is already subscribed.")
    }
    throw error
  }
}
