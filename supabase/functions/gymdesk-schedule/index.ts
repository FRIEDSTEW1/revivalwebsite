// Supabase Edge Function: gymdesk-schedule
//
// Scrapes Revival MMA's public Gymdesk booking page (no login, no API — the
// full weekly schedule is embedded in the page's HTML) and returns it as
// JSON, caching the result in Postgres for 30 minutes so we're not hitting
// Gymdesk's page on every visitor. Runs server-side because Gymdesk sends no
// CORS headers, so a browser can't fetch this page directly.
//
// Deploy with: supabase functions deploy gymdesk-schedule
// (see supabase/README.md for the one-time setup)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Override via `supabase secrets set GYMDESK_SUBDOMAIN=... GYMDESK_SCHEDULE_ID=...`
// if these ever change. Defaults are Revival MMA's real values.
const GYMDESK_SUBDOMAIN = Deno.env.get("GYMDESK_SUBDOMAIN") ?? "revival-mma"
const GYMDESK_BOOK_URL = `https://${GYMDESK_SUBDOMAIN}.gymdesk.com/book`
const CACHE_MAX_AGE_MS = 30 * 60 * 1000

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface GymdeskSlot {
  s: number
  day: number
  time: string
  recurring: boolean
  scheduled: string | null
  startDate: string | null
  cancelDate: string | null
}

interface GymdeskClass {
  name: string
  slots: GymdeskSlot[]
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#163;/g, "£")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&") // must be last
}

function parseGymdeskSchedule(html: string): GymdeskClass[] {
  const out: GymdeskClass[] = []
  const liRe = /<li attr-event="(\d+)"[^>]*>([\s\S]*?)<\/li>/g
  let m: RegExpExecArray | null

  while ((m = liRe.exec(html))) {
    const block = m[2]
    const titleM = /<h3 class="session-title">([\s\S]*?)<\/h3>/.exec(block)
    const name = titleM ? decodeHtmlEntities(titleM[1].trim()) : ""

    const datesM = /name="dates" value="([^"]*)"/.exec(block)
    let slots: GymdeskSlot[] = []
    if (datesM) {
      try {
        const arr = JSON.parse(decodeHtmlEntities(datesM[1]))
        slots = arr.map((d: Record<string, unknown>) => ({
          s: d.id,
          day: d.day,
          time: d.start,
          recurring: Boolean(d.recurring),
          scheduled: typeof d.scheduled === "string" ? d.scheduled : null,
          startDate: (d.start_date as string) || null,
          cancelDate: typeof d.cancel_dates === "string" ? d.cancel_dates : null,
        }))
      } catch {
        // Malformed slot JSON for this one class — skip it, don't fail the whole scrape.
      }
    }

    if (name && slots.length > 0) out.push({ name, slots })
  }

  return out
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: cached } = await supabase
    .from("gymdesk_schedule_cache")
    .select("data, fetched_at")
    .eq("id", 1)
    .maybeSingle()

  const isFresh =
    Boolean(cached?.fetched_at) &&
    Date.now() - new Date(cached!.fetched_at as string).getTime() < CACHE_MAX_AGE_MS

  if (isFresh) {
    return Response.json(cached!.data, { headers: CORS_HEADERS })
  }

  try {
    const res = await fetch(GYMDESK_BOOK_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RevivalScheduleBot/1.0)" },
    })
    if (!res.ok) throw new Error(`Gymdesk responded ${res.status}`)

    const classes = parseGymdeskSchedule(await res.text())

    await supabase
      .from("gymdesk_schedule_cache")
      .upsert({ id: 1, data: classes, fetched_at: new Date().toISOString() })

    return Response.json(classes, { headers: CORS_HEADERS })
  } catch (err) {
    // A live fetch failure is better served from stale cache than an empty widget.
    if (cached?.data) {
      return Response.json(cached.data, { headers: CORS_HEADERS })
    }
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502, headers: CORS_HEADERS }
    )
  }
})
