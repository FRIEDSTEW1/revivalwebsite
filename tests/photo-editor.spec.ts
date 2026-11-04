import { test, expect } from "@playwright/test"

for (const [section, table, publicPath, defaultY] of [
  ["classes", "classes", "/classes", 50],
  ["team", "team_members", "/team", 0],
  ["testimonials", "testimonials", "/", 50],
] as const) {
  test(`${section}: preview, keyboard, drag, reset, cancel, save and public rendering`, async ({ page }) => {
    let row: Record<string, unknown> = { id: "test-photo", name: "Photo Test", role: "Coach", category: "adults", type: "MMA", ageRange: "18+", description: "Test class", benefits: [], specialties: [], experience: "10", bio: "Test coach", content: "Test review", rating: 5, image: "/logo.jpeg", order: 0 }
    let writes = 0
    let failSave = false
    await page.addInitScript(() => {
      localStorage.setItem("sb-photo-test-auth-token", JSON.stringify({ access_token: "test", refresh_token: "test", token_type: "bearer", expires_at: 9999999999, user: { id: "test-user", aud: "authenticated", role: "authenticated", email: "test@example.com" } }))
    })
    await page.route("https://photo-test.supabase.co/**", async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (url.pathname === `/rest/v1/${table}`) {
        if (request.method() === "PATCH") {
          if (failSave) return route.fulfill({ status: 400, json: { message: "Could not find image_framing in schema cache", code: "PGRST204" } })
          row = { ...row, ...request.postDataJSON() }
          writes++
          return route.fulfill({ status: 204 })
        }
        return route.fulfill({ json: [row] })
      }
      return route.fulfill({ json: [], headers: { "content-range": "0-0/0" } })
    })
    await page.goto(`/admin/${section}`)
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    const zoom = page.getByRole("slider", { name: "Zoom" })
    const horizontal = page.getByRole("slider", { name: "Horizontal position" })
    const vertical = page.getByRole("slider", { name: "Vertical position" })
    await expect(zoom).toHaveValue("1")
    await expect(vertical).toHaveValue(String(defaultY))
    await zoom.focus()
    await zoom.press("ArrowRight")
    await expect(zoom).toHaveValue("1.01")
    await zoom.fill("2")
    await horizontal.fill("65")
    await vertical.fill("35")
    const preview = page.getByAltText("Photo framing preview")
    await expect(preview).toHaveCSS("object-position", "65% 35%")
    await expect(preview).toHaveCSS("transform", "matrix(2, 0, 0, 2, 0, 0)")
    await preview.scrollIntoViewIfNeeded()
    await expect.poll(() => preview.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
    const box = (await preview.locator("..").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 25, box.y + box.height / 2 + 20)
    await page.mouse.up()
    expect(Number(await horizontal.inputValue())).toBeLessThan(65)
    await page.getByRole("button", { name: "Reset framing" }).click()
    await expect(zoom).toHaveValue("1")
    await expect(vertical).toHaveValue(String(defaultY))
    await zoom.fill("1.5")
    await page.getByRole("button", { name: "Cancel", exact: true }).click()
    expect(writes).toBe(0)
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await expect(zoom).toHaveValue("1")
    await zoom.fill("1.7")
    await horizontal.fill("25")
    await vertical.fill("75")
    failSave = true
    await page.getByRole("button", { name: "Save", exact: true }).click()
    await expect(page.getByText(/Photo adjustments need a database update/)).toBeVisible()
    await expect(zoom).toHaveValue("1.7")
    failSave = false
    await page.getByRole("button", { name: "Save", exact: true }).click()
    await expect(page.getByRole("dialog")).toHaveCount(0)
    expect(row.image_framing).toEqual({ x: 25, y: 75, zoom: 1.7 })
    await page.reload()
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await expect(zoom).toHaveValue("1.7")
    await expect(horizontal).toHaveValue("25")
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole("dialog")).toBeVisible()
    expect(await page.getByRole("dialog").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    await zoom.scrollIntoViewIfNeeded()
    await page.screenshot({ path: `/tmp/revival-${section}-photo-editor.png` })
    await page.getByPlaceholder("Or paste an image URL").fill("/missing-photo.jpg")
    await expect(page.getByText("Image could not load.", { exact: false })).toBeVisible()
    await expect(zoom).toBeDisabled()
    await page.getByPlaceholder("Or paste an image URL").fill("/logo.jpeg")
    await expect(zoom).toBeEnabled()
    await expect(zoom).toHaveValue("1")
    await page.getByRole("button", { name: "Cancel", exact: true }).click()
    await page.goto(publicPath)
    const photo = section === "testimonials" ? page.locator('figcaption img').first() : page.getByAltText("Photo Test", { exact: true })
    await expect(photo).toHaveCSS("object-position", "25% 75%")
    await expect(photo).toHaveCSS("transform", "matrix(1.7, 0, 0, 1.7, 0, 0)")
    expect(writes).toBe(1)
  })
}

test("new class upload waits before saving and persists its framing", async ({ page }) => {
  let saved: Record<string, unknown> | undefined
  let releaseUpload!: () => void
  const uploadGate = new Promise<void>(resolve => { releaseUpload = resolve })
  await page.addInitScript(() => {
    localStorage.setItem("sb-photo-test-auth-token", JSON.stringify({ access_token: "test", refresh_token: "test", token_type: "bearer", expires_at: 9999999999, user: { id: "test-user", aud: "authenticated", role: "authenticated" } }))
  })
  await page.route("https://photo-test.supabase.co/**", async route => {
    const req = route.request()
    if (req.url().includes("/storage/v1/object/") && req.method() === "POST") {
      await uploadGate
      return route.fulfill({ json: { Key: "media/classes/test.jpeg" } })
    }
    if (req.url().includes("/storage/v1/object/public/")) {
      return route.fulfill({ path: "public/logo.jpeg", contentType: "image/jpeg" })
    }
    if (req.url().includes("/rest/v1/classes") && req.method() === "POST") {
      saved = req.postDataJSON()
      return route.fulfill({ status: 201 })
    }
    return route.fulfill({ json: [], headers: { "content-range": "0-0/0" } })
  })
  await page.goto("/admin/classes")
  await page.getByRole("button", { name: "Add", exact: true }).click()
  await page.getByLabel("Class Name").fill("New photo class")
  await page.locator('input[type="file"]').setInputFiles("public/logo.jpeg")
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeDisabled()
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeDisabled()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeVisible()
  releaseUpload()
  await expect(page.getByRole("slider", { name: "Zoom" })).toBeEnabled()
  await page.getByRole("slider", { name: "Zoom" }).fill("2.2")
  await page.getByRole("button", { name: "Save", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  expect(saved?.image_framing).toEqual({ x: 50, y: 50, zoom: 2.2 })
  expect(saved?.image).toMatch(/^https:\/\/photo-test.supabase.co\/storage\/v1\/object\/public\/media\/classes\//)
})
