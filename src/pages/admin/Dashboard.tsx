import { Link } from "react-router-dom"
import {
  ArrowRight,
  CalendarClock,
  Dumbbell,
  HelpCircle,
  Mail,
  MessageSquare,
  Star,
  Users,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { countRows, fetchAll } from "@/lib/adminApi"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { NewsletterRow } from "@/lib/types"

const statCards = [
  { key: "classes", label: "Classes", icon: Dumbbell, to: "/admin/classes" },
  { key: "team", label: "Team Members", icon: Users, to: "/admin/team" },
  { key: "testimonials", label: "Testimonials", icon: Star, to: "/admin/testimonials" },
  { key: "faq", label: "FAQ Items", icon: HelpCircle, to: "/admin/faq" },
  { key: "timetable", label: "Timetable Slots", icon: CalendarClock, to: "/admin/timetable" },
] as const

const EMPTY_DASHBOARD = {
  counts: { classes: 0, team: 0, testimonials: 0, faq: 0, timetable: 0 },
  unread: 0,
  subscribers: 0,
  recentSubs: [] as NewsletterRow[],
}

async function loadDashboard() {
  if (!isSupabaseConfigured) return EMPTY_DASHBOARD

  const [classes, team, testimonials, faq, timetable, unread, subscribers, recentSubs] =
    await Promise.all([
      countRows("classes"),
      countRows("team_members"),
      countRows("testimonials"),
      countRows("faq_items"),
      countRows("timetable_entries"),
      countRows("contact_submissions", { column: "read", value: false }),
      countRows("newsletter_subscribers"),
      fetchAll<NewsletterRow>("newsletter_subscribers", "created_at", { ascending: false }),
    ])

  return {
    counts: { classes, team, testimonials, faq, timetable },
    unread,
    subscribers,
    recentSubs: recentSubs.slice(0, 5),
  }
}

export function Dashboard() {
  const { data, loading, error } = useAsync(loadDashboard, [isSupabaseConfigured])

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="font-semibold">Connect Supabase to see live stats</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Follow <code>supabase/README.md</code> to link a project — until then the site runs on
          bundled sample content and the admin panel has nothing to manage yet.
        </p>
      </div>
    )
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />
  if (!data) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ key, label, icon: Icon, to }) => (
          <Link key={key} to={to}>
            <Card className="card-lift flex flex-col gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="font-serif text-3xl font-bold">{data.counts[key]}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Link to="/admin/messages">
          <Card className="card-lift flex items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
                <MessageSquare className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-serif text-lg font-bold">
                  {data.unread} unread {data.unread === 1 ? "message" : "messages"}
                </p>
                <p className="text-sm text-muted-foreground">From the contact form</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>
        </Link>

        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-serif text-lg font-bold">{data.subscribers} subscribers</p>
                <p className="text-sm text-muted-foreground">Newsletter signups</p>
              </div>
            </div>
            <Link
              to="/admin/newsletter"
              className="text-sm font-medium text-gold-dark hover:underline dark:text-gold"
            >
              View all
            </Link>
          </div>
          {data.recentSubs.length > 0 && (
            <ul className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
              {data.recentSubs.map((s) => (
                <li key={s.id} className="truncate">
                  {s.email}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
