export type ClassCategory = "kids" | "teens" | "adults"

export interface GymClass {
  id: string
  name: string
  category: ClassCategory
  type: string
  description: string
  ageRange: string
  benefits: string[]
  image: string
  order: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  specialties: string[]
  experience: string
  bio: string
  image: string
  order: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image: string
}

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

export interface TimetableEntry {
  id: string
  day: Weekday
  time: string
  className: string
  ageGroup: ClassCategory
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface PageContent {
  id: string
  page: string
  content: string
}

export interface ContactSubmission {
  name: string
  email: string
  phone?: string
  message: string
}

export interface ContactMessage extends ContactSubmission {
  id: string
  read: boolean
  archived: boolean
  created_at: string
}

export interface NewsletterSubscriber {
  email: string
}

export interface NewsletterRow {
  id: string
  email: string
  created_at: string
}

// Booking widget — see src/lib/gymdesk.ts and src/pages/Book.tsx

export interface GymdeskSlot {
  /** The slot's own Gymdesk event id — this becomes the `s` param in a booking link. */
  s: number
  /** Weekday, Gymdesk convention: 1 (Mon) – 7 (Sun). */
  day: number
  /** Start time, "HH:MM:SS". */
  time: string
  recurring: boolean
  /** Fixed date ("YYYY-MM-DD") if this is a one-off rather than a weekly slot. */
  scheduled: string | null
  /** This slot doesn't apply before this date. */
  startDate: string | null
  /** This slot is cancelled on this specific date. */
  cancelDate: string | null
}

export interface GymdeskClass {
  name: string
  slots: GymdeskSlot[]
}

/** A GymdeskClass that has been matched against an admin-set age rule. */
export interface MatchedClass extends GymdeskClass {
  discipline: string | null
}

export type BookingAudience = "child" | "adult" | "both"

export interface ClassAgeRule {
  id: string
  gymdesk_name: string
  audience: BookingAudience
  min_age: number | null
  max_age: number | null
  discipline: string | null
}

export interface BookingPerson {
  id: string
  audience: "adult" | "child"
  age?: number
  label: string
}

export interface Booking {
  id: string
  personId: string
  personLabel: string
  className: string
  discipline: string | null
  dateIso: string
  time: string
  link: string
}

/** A logged checkout attempt — see supabase/schema.sql `booking_requests`. */
export interface BookingRequest {
  id: string
  session_id: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  person_label: string
  class_name: string
  discipline: string | null
  date_iso: string
  time: string
  gymdesk_link: string
  people_count: number
  payment_status: "pending" | "paid"
  created_at: string
}
