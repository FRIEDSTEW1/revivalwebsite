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
