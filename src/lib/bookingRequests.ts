import { supabase } from "./supabase"
import type { BookingRequest } from "./types"

export type BookingRequestInput = Omit<BookingRequest, "id" | "created_at" | "payment_status">

/**
 * Logs one row per person+class in a checkout, right before sending someone
 * to pay. This is how the admin panel knows a booking attempt happened at
 * all — payment itself can't be confirmed automatically (see
 * supabase/README.md), so every attempt is recorded as "pending" and an
 * admin marks it "paid" after checking the real SumUp transactions.
 */
export async function submitBookingRequests(rows: BookingRequestInput[]): Promise<void> {
  if (!supabase) {
    throw new Error("Booking isn't connected yet — see supabase/README.md.")
  }
  const { error } = await supabase.from("booking_requests").insert(rows)
  if (error) throw error
}
