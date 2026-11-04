import { test, expect } from "@playwright/test"

for (const [count, paymentCode] of [[1, "QPX4P9OF"], [2, "Q6OWZDSM"], [3, "QZN28R61"]] as const) {
  test(`preserves ${count}-person checkout, payment destination and admin reconciliation`, async ({ page }) => {
    let rows: Record<string, unknown>[] = []
    await page.addInitScript(() => {
      localStorage.setItem("sb-photo-test-auth-token", JSON.stringify({ access_token: "test", refresh_token: "test", token_type: "bearer", expires_at: 9999999999, user: { id: "test-user", aud: "authenticated", role: "authenticated" } }))
      // Keep the entire payment interaction inside the test: never open SumUp.
      window.open = (() => ({ location: { set href(value: string) { sessionStorage.setItem("test-payment-url", value) } }, close() {} })) as typeof window.open
    })
    await page.route("https://photo-test.supabase.co/**", async route => {
      const req = route.request()
      const url = new URL(req.url())
      if (url.pathname.includes("/functions/v1/gymdesk-schedule")) {
        return route.fulfill({ json: [{ name: "Test MMA", slots: Array.from({ length: 7 }, (_, i) => ({ s: 100 + i, day: i + 1, time: "23:59:00", recurring: true, scheduled: null, startDate: null, cancelDate: null })) }] })
      }
      if (url.pathname === "/rest/v1/class_age_rules") {
        return route.fulfill({ json: [{ id: "rule", gymdesk_name: "Test MMA", audience: "both", min_age: 5, max_age: 15, discipline: "MMA" }] })
      }
      if (url.pathname === "/rest/v1/booking_requests") {
        if (req.method() === "POST") {
          rows = req.postDataJSON().map((row: Record<string, unknown>, index: number) => ({ ...row, id: `booking-${index}`, created_at: new Date().toISOString(), payment_status: "pending" }))
          return route.fulfill({ status: 201 })
        }
        if (req.method() === "PATCH") {
          const id = url.searchParams.get("id")?.replace("eq.", "")
          rows = rows.map(row => row.id === id ? { ...row, ...req.postDataJSON() } : row)
          return route.fulfill({ status: 204 })
        }
        return route.fulfill({ json: rows, headers: { "content-range": `0-${rows.length}/${rows.length}` } })
      }
      return route.fulfill({ json: [], headers: { "content-range": "0-0/0" } })
    })
    await page.goto("/book")
    for (let i = 0; i < count; i++) {
      if (i > 0) {
        await page.getByRole("button", { name: "Add Another Person", exact: true }).click()
        await page.getByRole("button", { name: "Child Under 16" }).click()
        await page.getByLabel("How old is your child?").fill("8")
      }
      await page.getByRole("button", { name: "Find Classes", exact: true }).click()
      await page.getByRole("button", { name: /Test MMA.*Book/ }).click()
    }
    if (count === 3) await expect(page.getByRole("button", { name: "Add Another Person", exact: true })).toHaveCount(0)
    await page.getByRole("button", { name: "Continue to Payment" }).click()
    const pay = page.getByRole("button", { name: `Pay for ${count} ${count === 1 ? "Person" : "People"}`, exact: true })
    await expect(pay).toBeDisabled()
    await page.getByLabel("Full name", { exact: true }).fill("Test Booker")
    await page.getByLabel("Email", { exact: true }).fill("booker@example.com")
    await pay.click()
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem("test-payment-url"))).toBe(`https://pay.sumup.com/b2c/${paymentCode}`)
    expect(rows).toHaveLength(count)
    expect(new Set(rows.map(row => row.session_id)).size).toBe(1)
    for (const row of rows) {
      expect(row.people_count).toBe(count)
      expect(row.payment_status).toBe("pending")
      expect(row.gymdesk_link).toMatch(/^https:\/\/revival-mma.gymdesk.com\/book\?date=.*&schedule=28679$/)
    }
    await page.goto("/admin/booking-requests")
    await expect(page.getByRole("heading", { name: "Booking Requests" })).toBeVisible()
    await page.getByRole("button", { name: "Mark Paid", exact: true }).click()
    await expect.poll(() => rows.every(row => row.payment_status === "paid")).toBe(true)
    await page.getByRole("button", { name: "Paid", exact: true }).click()
    await expect(page.getByRole("button", { name: "Mark Pending" })).toBeVisible()
  })
}
