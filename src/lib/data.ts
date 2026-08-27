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

// Read paths: fall back to the real recovered content when Supabase isn't
// configured yet, so the site is fully browsable out of the box. Once
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set and the schema+seed
// have been run (see supabase/), everything reads/writes from Postgres.

export async function getClasses(): Promise<GymClass[]> {
  if (!supabase) return classesSeed
  const { data, error } = await supabase.from("classes").select("*").order("name")
  if (error) throw error
  return data as GymClass[]
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!supabase) return teamSeed
  const { data, error } = await supabase.from("team_members").select("*").order("experience", { ascending: false })
  if (error) throw error
  return data as TeamMember[]
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return testimonialsSeed
  const { data, error } = await supabase.from("testimonials").select("*")
  if (error) throw error
  return data as Testimonial[]
}

export async function getTimetable(): Promise<TimetableEntry[]> {
  if (!supabase) return timetableSeed
  const { data, error } = await supabase.from("timetable_entries").select("*")
  if (error) throw error
  return data as TimetableEntry[]
}

export async function getFAQs(): Promise<FAQItem[]> {
  if (!supabase) return [...faqSeed].sort((a, b) => a.order - b.order)
  const { data, error } = await supabase.from("faq_items").select("*").order("order")
  if (error) throw error
  return data as FAQItem[]
}

export async function getPageContent(page: string): Promise<string | null> {
  if (!supabase) return pageContentSeed.find((p) => p.page === page)?.content ?? null
  const { data, error } = await supabase
    .from("page_content")
    .select("content")
    .eq("page", page)
    .maybeSingle()
  if (error) throw error
  return data?.content ?? null
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
