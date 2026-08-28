// Real SumUp payment links, one per headcount. There's deliberately no link
// for 4+ people — the booking widget caps a cart at 3 people and directs
// anyone booking a larger group to contact the gym directly, rather than
// guessing at a formula for a price point nobody's confirmed.
const SUMUP_LINKS: Record<1 | 2 | 3, string> = {
  1: "https://pay.sumup.com/b2c/QPX4P9OF",
  2: "https://pay.sumup.com/b2c/Q6OWZDSM",
  3: "https://pay.sumup.com/b2c/QZN28R61",
}

export const MAX_BOOKING_PEOPLE = 3

/** "A person" = one distinct adult/child added to the cart, not one per class. */
export function getSumupLink(peopleCount: number): string | null {
  if (peopleCount >= 1 && peopleCount <= 3) {
    return SUMUP_LINKS[peopleCount as 1 | 2 | 3]
  }
  return null
}
