import { test, expect } from "@playwright/test"

test("staff can reconcile an existing booking session", async ({ page }) => {
  let rows = ["Adult", "Child (8)"].map((person_label, index) => ({
    id: `booking-${index}`,
    session_id: "existing-booking",
    created_at: "2026-10-01T12:00:00.000Z",
    contact_name: "Test Booker",
    contact_email: "booker@example.com",
    person_label,
    class_name: "Test MMA",
    date_iso: "2026-10-02",
    time: "18:00:00",
    people_count: 2,
    payment_status: "pending",
    gymdesk_link: "https://revival-mma.gymdesk.com/book?date=2026-10-02&s=100&schedule=28679",
  }))
  await page.addInitScript(() => {
    localStorage.setItem("sb-photo-test-auth-token", JSON.stringify({
      access_token: "test",
      refresh_token: "test",
      token_type: "bearer",
      expires_at: 9999999999,
      user: { id: "test-user", aud: "authenticated", role: "authenticated" },
    }))
  })
  await page.route("https://photo-test.supabase.co/**", async route => {
    const req = route.request()
    const url = new URL(req.url())
    if (url.pathname !== "/rest/v1/booking_requests") {
      return route.fulfill({ json: [], headers: { "content-range": "0-0/0" } })
    }
    if (req.method() === "PATCH") {
      const id = url.searchParams.get("id")?.replace("eq.", "")
      rows = rows.map(row => row.id === id ? { ...row, ...req.postDataJSON() } : row)
      return route.fulfill({ status: 204 })
    }
    return route.fulfill({ json: rows, headers: { "content-range": `0-${rows.length - 1}/${rows.length}` } })
  })
  await page.goto("/admin/booking-requests")
  await expect(page.getByRole("heading", { name: "Booking Requests" })).toBeVisible()
  await page.getByRole("button", { name: "Mark Paid", exact: true }).click()
  await expect.poll(() => rows.map(row => row.payment_status)).toEqual(["paid", "paid"])
  await page.getByRole("button", { name: "Paid", exact: true }).click()
  await expect(page.getByRole("button", { name: "Mark Pending" })).toBeVisible()
})

test("the sticky mobile CTA opens the trial request form and old contact links still work", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  let submission: unknown
  const selfBookingRequests: string[] = []
  await page.route("https://photo-test.supabase.co/**", route => {
    const req = route.request()
    const { pathname } = new URL(req.url())
    if (pathname === "/rest/v1/contact_submissions" && req.method() === "POST") {
      submission = req.postDataJSON()
      return route.fulfill({ status: 201 })
    }
    if (pathname.endsWith("/gymdesk-schedule") || pathname.endsWith("/booking_requests")) {
      selfBookingRequests.push(pathname)
    }
    return route.fulfill({ json: [] })
  })
  await page.goto("/faq")
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded()
  const cta = page.getByRole("banner").getByRole("link", { name: "Book Trial", exact: true })
  await expect(cta).toBeInViewport({ ratio: 1 })
  await cta.click()
  await expect(page).toHaveURL(/\/book$/)
  await expect(page.getByRole("heading", { name: "Book a Trial" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Find Classes" })).toHaveCount(0)

  await page.goto("/contact")
  await expect(page).toHaveURL(/\/book$/)
  await page.getByLabel("Full Name").fill("Test Booker")
  await page.getByLabel("Email Address").fill("booker@example.com")
  await page.getByLabel("Trial Details").fill("Adult MMA on Tuesdays")
  await page.getByRole("button", { name: "Request Trial" }).click()
  await expect(page.getByRole("status")).toContainText("Thanks for your trial request.")
  expect(submission).toEqual({
    name: "Test Booker",
    email: "booker@example.com",
    phone: "",
    message: "Adult MMA on Tuesdays",
  })
  expect(selfBookingRequests).toEqual([])
})
